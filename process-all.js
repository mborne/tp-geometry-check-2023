const shell = require('shelljs');
const repositories = require('./config/repositories.json');
const fs = require('fs');

const PMD_HOME = process.env.PMD_HOME || '/opt/pmd-bin-6.53.0';
if ( ! fs.existsSync(PMD_HOME) ){
    console.error(`PMD_HOME not found (expected : '${PMD_HOME}', see https://pmd.github.io/)`);
    process.exit(1);
}


const getCoverage = require('./helpers/getCoverage');

shell.mkdir('-p', __dirname + '/data');

let results = [];

/*
 * pour chaque dépôt...
 */
for (const [username, repositoryUrl] of Object.entries(repositories)) {
    console.log(`-- ${username} - ${repositoryUrl} ...`);

    let result = {
        username: username,
        repositoryUrl: repositoryUrl
    };

    let repositoryDir = __dirname + '/data/' + username + '/tp-pattern-geometry';

    /*
     * on clone au besoin le dépôt
     */
    if ( ! fs.existsSync(repositoryDir) ){
        let commandClone = `git clone ${repositoryUrl} ${repositoryDir}`;
        shell.exec(commandClone, { silent: true });
    }

    // on se place dans le dossier du dépôt
    shell.cd(repositoryDir);

    /*
     * result.branchName : on récupère le nom de la branche par défaut
     */
    {
        let commandBranchName = 'git symbolic-ref --short HEAD';
        result.branchName = shell.exec(commandBranchName, { silent: true }).stdout.trim();
        console.log('BRANCH : '+result.branchName);
    }

    /*
     * result.commitId : on récupère l'identifiant du commit
     */
    {
        let commandCommitId = 'git rev-parse HEAD';
        result.commitId = shell.exec(commandCommitId, { silent: true }).stdout.trim();
        console.log('COMMIT : '+result.commitId);
    }

    /*
     * récupération de la liste des branches
     */
    {
        let commandBranches = `git branch -a > ${repositoryDir}.branches.txt 2>&1`;
        shell.exec(commandBranches);
    }

    /*
     * result.test : on lance la construction
     */
    {
        let commandMvn = `mvn -B clean package -DskipTests > ${repositoryDir}.build.txt 2>&1`;
        result.build = shell.exec(commandMvn).code === 0;
        console.log('BUILD : ' + (result.build ? 'SUCCESS' : 'FAILURE'));
    }

    /*
     * result.test : on lance la construction avec les tests
     */
    {
        let commandMvn = `mvn -B clean package jacoco:report > ${repositoryDir}.build-test.txt 2>&1`;
        result.test = shell.exec(commandMvn).code === 0;
        console.log('TEST : ' + (result.test ? 'SUCCESS' : 'FAILURE'));
    }

    /*
    * result.coverage : on récupérer le pourcentage de couverture
    */
    {
        let coveragePath = `${repositoryDir}/target/site/jacoco/jacoco.xml`;
        result.coverage = getCoverage(coveragePath);
        console.log(`COVERAGE : ${result.coverage}%`);
    }

    /*
     * analyse du code avec PMD
     */
    {
        let pmdReportPath = `${repositoryDir}.pmd.html`;
        let pmdConfigPath = __dirname+'/config/pmd.xml';
        // TODO PMD_PATH
        let commandPmd = `${PMD_HOME}/bin/run.sh pmd --dir src/main/java --rulesets ${pmdConfigPath} --short-names --format summaryhtml --report-file ${pmdReportPath}`;
        shell.exec(commandPmd,{silent: true});
        result.pmd = fs.existsSync(pmdReportPath);
        console.log('PMD : ' + (result.pmd ? 'SUCCESS' : 'FAILURE'));
    }

    results.push(result);
}

fs.writeFileSync(
    __dirname + '/results.json',
    JSON.stringify(results, null, 2)
);





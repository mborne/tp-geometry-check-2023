# Correction TP-PATTERN-GEOMETRY

Correction du TP-PATTERN-GEOMETRY et retours sur les problèmes récurrents.

## Généralités

### G.1 - La convention de nommage java doit être respectée

Par exemple, la première lettre d'une variable doit être en minuscule :

```java
    public void insert(Coordinate coordinate){
        this.Xvalue.add(coordinate.getX());
        this.Yvalue.add(coordinate.getY());
    }
```

### G.2 - On nomme avec un pluriel une variable correspondant à un collection

```java
    public void insert(Coordinate coordinate){
        this.Xvalue.add(coordinate.getX());
        this.Yvalue.add(coordinate.getY());
    }
```

->

```java
    public void insert(Coordinate coordinate){
        this.xValues.add(coordinate.getX());
        this.yValues.add(coordinate.getY());
    }
```


### G.3 - On évite les abréviations


```java
	public LineString(List<Point> p) {
		this.points=p;
	}
```

->

```java
	public LineString(List<Point> points) {
		this.points=points;
	}
```




### G.4 - Le code doit être mis en forme

* Pas d'espace inutiles
* Pas de saut de lignes inutiles
* ...

NB : Les IDE disposent d'outils qui permettent de mettre en forme automatiquement le code.

### G.5 - Les codes générés par les IDE doivent être supprimé du code source

Les lignes TODO de ce style ne doivent pas être conservée lorsque l'on implémente les méthodes :

```java
public boolean isEmpty() {
    // TODO Auto-generated method stub
    return bottomLeft.isEmpty() || TopRight.isEmpty();
}
```

### G.6 - Les codes supprimés doivent être supprimé

On ne conserve pas des codes en commentaires de ce type :

```java
    @Override
    public void translate(double dx, double dy){
        //this.coordinate.getX = this.coordinate.getX + dx ;
        //this.coordinate.getY = this.coordinate.getY + dy ; 
        this.coordinate = new Coordinate(this.coordinate.getX()+dx, this.coordinate.getY()+dy);
    }
```

### G.7 - On n'expose pas publiquement des données pour tester plus facilement

Par exemple, `getXValues()` et `getYValues()` ci-dessous :

```java
class EnvelopeBuilder {    
    private List<Double> xVals;
    private List<Double> yVals;

    public EnvelopeBuilder() {
        this.xVals = new ArrayList<Double>();
        this.yVals = new ArrayList<Double>();
    }
    
    public List<Double> getXValues() {
        return this.xVals;
    }

    public List<Double> getYValues() {
        return this.yVals;
    }
}
```


### G.8 - On renvoie directement le résultat d'une opération booléenne

```java
    public Boolean isEmpty(){
        if (bottomLeft.isEmpty() || topRight.isEmpty()){
            return true;
        }
        else return false;
    }
```

->


```java
    public Boolean isEmpty(){
        return bottomLeft.isEmpty() || topRight.isEmpty();
    }
```


### G.9 - Ne pas faire des appels inutiles au constructeur parent

```java	
	public Coordinate() {
		super();
		this.x = Double.NaN;
		this.y = Double.NaN;
	}
```

->

```java	
	public Coordinate() {
		this.x = Double.NaN;
		this.y = Double.NaN;
	}
```

## G.10 - On utilise isEmpty pour tester si une collection est vide

```java
    @Override
    public Boolean isEmpty(){
        return getNumPoints()==0;
    }
```

=>


```java
class LineString {
    public Boolean isEmpty(){
        return this.points.isEmpty();
    }
}
```


## Algorithmie

### A.1 - Utiliser des abstraction pour simplifier les algorithmes

Quand on manipule des `xMin`, `xMax`, `yMin` et `yMax` dans `EnvelopeBuilder`, on manipule des intervalles.

En définissant une classe face à ce concept mathématique, on décompose les algorithmes, on évite les redondances, on facilite les tests et on simplifie les codes.

(voir [Interval](https://github.com/locationtech/jts/blob/jts-1.18.2/modules/core/src/main/java/org/locationtech/jts/index/strtree/Interval.java#L16-L72) qui sert de support pour l'implémentation d'indexes spatiaux dans JTS)



### A.2 - Utiliser les valeurs infinies plutôt que des valeurs arbitraire

```java
    public Envelope build(){
        double minX = 10E9;
        double minY = 10E9;
        double maxX = 0;
        double maxY = 0;
        //...
    }
```

->


```java
    public Envelope build(){
        double minX = Double.POSITIVE_INFINITY;
        double minY = Double.POSITIVE_INFINITY;
        double maxX = Double.NEGATIVE_INFINITY;
        double maxY = Double.NEGATIVE_INFINITY;
    }
```

### A.3 - Il existe un algorithme simple pour concaténer une chaîne avec des séparateurs...

```java
String result = "";
for ( int i = 0 ; i < items.size(); i++ ){
    // on préfixe tous les éléments sauf le premier par le séparateur
	if ( i != 0 ){
        result += ",";
    }
	result += items.get(i).toString();
}
```





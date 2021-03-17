// utilities and definitions

const Category = {
    "language" : "language",
    "fp" : "functional programming",
};

let topics = {};

const defineSource = (title, href) => ({
  "title" : title,
  "href"  : href,
});

const defineTopic = (name, description, sources, category, requires) => {
  const id = name.toLowerCase().replace(/[^a-z]+/g, "-");
  const topic = {
    "id"          : id,
      "name"        : name,
      "description" : description||"",
      "sources"     : sources||[],
      "category"    : category||Category.language,
      "requires"    : requires||[],
      // for vis.js
      "label"       : name,
      "group"       : category||Category.language,
  };
  topics[id] = topic;
  return id;
};

// topics

const parametricTypes = defineTopic(
  'Parametric Types',
  'Known in Java as Generic Types and in C++ as Class Templates. Types which has to be parametrized with another type in order to create an instantiable type, e.g. List, Option, Function, IO',
  [
    defineSource('Generic Classes | Tour of Scala', 'https://docs.scala-lang.org/tour/generic-classes.html'),
  ],
  Category.language,
  []
);

const implicits = defineTopic(
  'Implicits',
  'Mechanism of finding and passing arguments into functions and methods by the compiler, based on their type',
  [],
  Category.language,
  []
);

const typeClasses = defineTopic(
  'Type Classes',
  'A way of defining some interface and letting our type use it, which doesn\'t require us to modify the type to extend some trait/class',
  [],
  Category.fp,
  [parametricTypes, implicits]
);

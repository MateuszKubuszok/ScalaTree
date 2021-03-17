// utilities and definitions

const Category = {
    "language" : "language",
    "fp" : "functional programming",
};

let topics = {};

const defineTopic = (name, description, category, requires) => {
	const id = name.toLowerCase().replace(/[^a-z]+/g, "-");
	const topic = {
		"id"          : id,
	    "name"        : name,
	    "description" : description||"",
	    "category"    : category||Category.language,
	    "requires"    : requires||[],
	    "label"       : name,
	};
	topics[id] = topic;
	return id;
};

// topics

const parametricTypes = defineTopic(
	'Parametric Types',
	'TODO',
	Category.language,
	[]
);

const implicits = defineTopic(
	'Implicits',
	'TODO',
	Category.language,
	[]
);

const typeClasses = defineTopic(
	'Type Classes',
	'TODO',
	Category.fp,
	[parametricTypes, implicits]
);

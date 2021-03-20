# Scala Tree

The idea of this project is to provide some easy-to-read information about the order of learning Scala-related concepts which would make things easier on the reader rather than harder.

Order is presented using a directed graph. The reader could click on each concept to see a short description and a list of sources.

## Constribution

To contribute:

 * fork the repository
 * edit [data.js](data.js) file
 * create a pull request to this repo

### Adding a new topic

```javascript
// returned value can be used to define this topic as required to learn another one
const newTopic = defineTopic(
  // define a name - it will be also used to generate id by replacing all non-letters with '-''
  'New topic',
  // define a short description
  `This will be a description`, // use backticks as they support multiline strings 
  // define list of sources (title and optional link)
  [
    defineSource('title', 'https://example.com'), // use trailing commas
  ],
  Category.language, // if needed add a new category and define a color for it
  // define a list of required topics to learn this one 
  [
    oneRequiredTopic,
    anotherRequiredTopic, // use trailing comma here as well
  ]
);
```

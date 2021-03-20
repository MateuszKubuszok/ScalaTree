// HTML elements
const diagramElement     = document.getElementById('diagram');
const contentElement     = document.getElementById('content');
const nameElement        = document.getElementById('name');
const descriptionElement = document.getElementById('description');
const sourcesElement     = document.getElementById('sources');
const codeElements       = () => document.querySelectorAll('code, pre');

const hiddenEmptyDescriptionsClass = 'no-topic';

// set #content elements, hash location and syntax highlighting
const setContent = topic => {
  const description = (topic.description !== '' && topic.description.toUpperCase() !== 'TODO') ?
    topic.description :
    'No description yet - if you want to help please contribute with a PR!';
  const sources = (topic.sources.length > 0) ? 
    ('<ul>' +
      topic.sources
        .map(src => src.href ? ('<a href="' + src.href + '">' + src.title + '</a>') : src.title)
        .map(src => '<li>' + src + '</li>')
        .join('') +
      '</ul>') :
    'No sources yet - if you know some great sources please contribute with a PR!';
  const highlightElemement = block => {
    block.classList.add('scala');
    hljs.highlightBlock(block);
  };

  nameElement.innerHTML        = topic.name;
  descriptionElement.innerHTML = description;
  sourcesElement.innerHTML     = sources;
  window.location.hash         = topic.id;

  codeElements().forEach(highlightElemement);
  contentElement.classList.remove(hiddenEmptyDescriptionsClass);
};
// clear fields and hide empty fieldsets
const unsetContent = () => {
  contentElement.classList.add(hiddenEmptyDescriptionsClass);

  nameElement.innerHTML        = '';
  descriptionElement.innerHTML = '';
  sourcesElement.innerHTML     = '';
  window.location.hash         = '';
};

// manual workaround for https://github.com/visjs/vis-network/issues/83 and https://github.com/visjs/vis-network/issues/84
const topicsOrder = (() => {
  let tmp = {};
  Object.values(topics).sort((a,b) => a.hsort - b.hsort).forEach(t => tmp[t.id] = Object.keys(tmp).length);
  return tmp;
})();
const sortedTopics = Object.values(topics).sort((a, b) => topicsOrder[a.id] - topicsOrder[b.id]);

// Graph's data
const nodes = new vis.DataSet(sortedTopics);
const edges = new vis.DataSet(
  sortedTopics.flatMap(topic => topic.requires.map(parentId => ({
    from   : parentId,
    to     : topic.id,
    arrows : 'to',
  })))
  .sort((a, b) => topicsOrder[a.to] - topicsOrder[b.to])
);
const data = {
  nodes: nodes,
  edges: edges,
};

// Vis.js options
const options = {
  autoResize: true,
  height: '100%',
  width: '100%',
  layout: {
    hierarchical: {
      direction: 'UD'
    }
  },
  interaction: {
    dragNodes: false,
    keyboard: true,
    hover: true,
    multiselect: false,
    navigationButtons: true,
  },
  nodes: {
    shape: 'box',
    widthConstraint: 100,
  },
  groups: {
    [Category.language]: {
      color: '#f1948a',
    },
    [Category.fp]: {
      color: '#aed6f1',
    },
    [Category.akka]: {
      color: '#82e0aa',
    },
    [Category.patterns]: {
      color: '#f9e79f',
    },
  },
  physics: {
    enabled: true,
    hierarchicalRepulsion: {
      springLength: 50,
      damping: 0.5,
      avoidOverlap: 0.5,
    }
  }
};

// initialize Graph and connect listeners
const network = new vis.Network(diagramElement, data, options);
network.on('selectNode', params => {
  if (params.nodes.length > 0) {
    setContent(topics[params.nodes[0]]);
  }
});
network.on('deselectNode', params => {
  unsetContent();
});
network.on('hoverNode', params => {
  network.canvas.body.container.style.cursor = 'pointer'
});
network.on('blurNode', params => {
  network.canvas.body.container.style.cursor = 'default'
});
network.on('stabilizationIterationsDone', params => {
  network.setOptions( { physics: false } );
});

// bind location hash to node selection
const traceHashChange = () => {
  const hash = window.location.hash.replace('#', '');
  if (hash === '') return;
  if (network.getSelectedNodes().find(n => n === hash)) return;
  const topic = topics[hash];
  if (topics[hash]) {
    network.setSelection({nodes:[hash], edges: []});
    setContent(topic);
  }
};
window.onhashchange = traceHashChange;
traceHashChange();

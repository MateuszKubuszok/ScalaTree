// set #content elements and hash location
const setContent = topic => {
  document.getElementById('name').innerHTML=topic.name;
  document.getElementById('description').innerHTML=topic.description;
  const sources = '<ul>' + topic.sources.map(source => {
    if (source.href) return '<a href="' + source.href + '">' + source.title + '</a>';
    else return source.title;
  }).map(src => '<li>' + src + '</li>').join('') + '</ul>';
  document.getElementById('sources').innerHTML=sources;
  document.getElementById('content').classList.remove('no-topic');
  window.location.hash = topic.id;
};
const unsetContent = () => {
  document.getElementById('content').classList.add('no-topic');
  document.getElementById('name').innerHTML="";
  document.getElementById('description').innerHTML="";
  document.getElementById('sources').innerHTML="";
  window.location.hash = '';
};

// manual workaround for https://github.com/visjs/vis-network/issues/83 and https://github.com/visjs/vis-network/issues/84
const topicsOrder = (() => {
  let tmp = {};
  Object.values(topics).sort((a,b) => a.hsort - b.hsort).forEach(t => tmp[t.id] = Object.keys(tmp).length);
  return tmp;
})();
const sortedTopics = Object.values(topics).sort((a, b) => topicsOrder[a.id] - topicsOrder[b.id]);

// create an array with nodes
const nodes = new vis.DataSet(sortedTopics);

// create an array with edges
const edges = new vis.DataSet(
  sortedTopics.flatMap(topic => topic.requires.map(parentId => ({
    from   : parentId,
    to     : topic.id,
    arrows : 'to',
  })))
  .sort((a, b) => topicsOrder[a.to] - topicsOrder[b.to])
);

// create a network
const container = document.getElementById('diagram');

// provide the data in the vis format
const data = {
  nodes: nodes,
  edges: edges,
};
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

// initialize your network!
const network = new vis.Network(container, data, options);
network.on('selectNode', params => {
  if (params.nodes.length > 0) {
    setContent(topics[params.nodes[0]]);
  }
});
network.on('deselectNode', params => {
  unsetContent();
});
const traceHashChange = () => {
  const hash = window.location.hash.replace('#', '');
  if (hash === '') return;
  if (network.getSelectedNodes().find(n => n === hash)) return;
  const topic = topics[hash];
  if (topics) {
    network.setSelection({nodes:[hash], edges: []});
    setContent(topic);
  }
};
network.on("hoverNode", function (params) {
  network.canvas.body.container.style.cursor = 'pointer'
});
network.on("blurNode", function (params) {
  network.canvas.body.container.style.cursor = 'default'
});


traceHashChange();
window.onhashchange = traceHashChange;

network.on("stabilizationIterationsDone", function(){
  network.setOptions( { physics: false } );
});

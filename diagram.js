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

// create an array with nodes
const nodes = new vis.DataSet(Object.values(topics));

// create an array with edges
const edges = new vis.DataSet(
  Object.values(topics).flatMap(topic => topic.requires.map(parentId => ({
    from: parentId,
    to: topic.id,
    arrows: 'to',
  })))
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
    hover: true,
    multiselect: false,
  },
  nodes: {
    shape: 'box'
  },
  groups: {
    [Category.language]: {
      color: '#f1948a',
    },
    [Category.fp]: {
      color: "#aed6f1",
    },
  },
  physics: {
    hierarchicalRepulsion: {
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
traceHashChange();

window.onhashchange = traceHashChange;

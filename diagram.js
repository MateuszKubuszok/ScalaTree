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
    const topic = topics[params.nodes[0]];
    document.getElementById('name').innerHTML=topic.name;
    document.getElementById('description').innerHTML=topic.description;
    const sources = '<ul>' + topic.sources.map(source => {
      if (source.href) return '<a href="' + source.href + '">' + source.title + '</a>';
      else return source.title;
    }).map(src => '<li>' + src + '</li>').join('') + '</ul>';
    console.log(sources);
    document.getElementById('sources').innerHTML=sources;
    document.getElementById('content').classList.remove('no-topic');
  }
});
network.on('deselectNode', params => {
  document.getElementById('content').classList.add('no-topic');
  document.getElementById('name').innerHTML="";
  document.getElementById('description').innerHTML="";
  document.getElementById('sources').innerHTML="";
});

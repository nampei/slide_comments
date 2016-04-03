$(function(){
  var socket = io();

  var type = $("#type").val();
  var room = $("#room").val();

  socket.on('connect', function() {
     socket.emit('join room', type, room);
  });

  socket.on('broad chat', function(chat) {　　
    marquee(chat.message);
  });

  socket.on('broad slide', function(state) {
    Reveal.setState(state);
  });

  socket.on('broad slide-refresh', function(state) {
    refresh(state);
  });

  $('form').submit(function() {

    var message = $('#m').val();
    socket.emit('chat', {
      message:message
    });

    marquee(message);

    $('#m').val('');
    return false;
  });

  // Full list of configuration options available at:
  // https://github.com/hakimel/reveal.js#configuration
  Reveal.initialize({
    controls: true,
    progress: true,
    history: true,
    center: true,
    help: false,
    transition: 'slide', // none/fade/slide/convex/concave/zoom
    keyboard: {
      82 /* r */ : function() {
        var state = Reveal.getState();
        refresh(state)
        socket.emit('slide refresh', state);
      }
    },
    // Optional reveal.js plugins
    dependencies: [{
      src: '../../../public/lib/js/classList.js',
      condition: function() {
        return !document.body.classList;
      }
    }, {
      src: '../../../public/plugin/markdown/marked.js',
      condition: function() {
        return !!document.querySelector('[data-markdown]');
      }
    }, {
      src: '../../../public/plugin/markdown/markdown.js',
      condition: function() {
        return !!document.querySelector('[data-markdown]');
      }
    }, {
      src: '../../../public/plugin/highlight/highlight.js',
      async: true,
      callback: function() {
        hljs.initHighlightingOnLoad();
      }
    }, {
      src: '../../../public/plugin/zoom-js/zoom.js',
      async: true
    }, {
      src: '../../../public/plugin/notes/notes.js',
      async: true
    }]
  });


  (function() {
    Reveal.addEventListener('ready', postState);
    Reveal.addEventListener('slidechanged', postState);
    Reveal.addEventListener('fragmentshown', postState);
    Reveal.addEventListener('fragmenthidden', postState);
    Reveal.addEventListener('overviewhidden', postState);
    Reveal.addEventListener('overviewshown', postState);
    Reveal.addEventListener('paused', postState);
    Reveal.addEventListener('resumed', postState);

    function postState(e){
      socket.emit('slide state', Reveal.getState());
    }
  }())

  function refresh(state) {
    var $slide = $('<section>').attr('data-markdown', '../../../public/md/slide.md')
                .attr('data-separator', '^\\r?\\n---\\r?\\n$')
                .attr('data-separator-vertical', '^\\r?\\n--\\r?\\n$')
                .attr('data-separator-notes', '^Note:');

    $('.slides').empty().append($slide);

    RevealMarkdown.initialize();
    Reveal.setState(state);

    // markdown
    $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
  }

  function marquee(message) {

    var $marquee = $('<div />', {
      class: 'marquee',
      css: {
        'top': Math.random() * ($(window).height()) + 'px',
        'font-size': Math.random() * (30 - 10) + 10 + 'px',
      },
      text: message
    }).bind('finished', function () {
      $(this).remove();
    });

    $('#marquee-area')
      .append($marquee);

    $marquee.marquee();
  }
});

$(function(){
  var socket = io();

  var type = $("#type").val();
  var room = $("#room").val();

  socket.on('connect', function() {
     socket.emit('join room', type, room);
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

  socket.on('broad chat', function(chat) {　　
    marquee(chat.message);
  });

  socket.on('broad slide', function(state) {　　
    Reveal.setState(state);
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
      82: refresh
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


  (function addEventListener() {
    Reveal.addEventListener('ready', post);
    Reveal.addEventListener('slidechanged', post);
    Reveal.addEventListener('fragmentshown', post);
    Reveal.addEventListener('fragmenthidden', post);
    Reveal.addEventListener('overviewhidden', post);
    Reveal.addEventListener('overviewshown', post);
    Reveal.addEventListener('paused', post);
    Reveal.addEventListener('resumed', post);
  }())

  function post(e){
    socket.emit('slide state', Reveal.getState());
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

  function refresh() {
    var $slide = $('<section>').attr('data-markdown', '../../../public/md/slide.md')
                .attr('data-separator', '^\\r?\\n---\\r?\\n$')
                .attr('data-separator-vertical', '^\\r?\\n--\\r?\\n$')
                .attr('data-separator-notes', '^Note:')
    $('.slides').empty().append($slide);
    RevealMarkdown.initialize();
    Reveal.setState(Reveal.getState());
  }

});

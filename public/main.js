$(function() {
  // Initialize variables
  var $window = $(window);
  var $lines = $('#lines'); // Input for username

  var socket = io();

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('last10', (data) => {
    $lines.html(data.replace(/[\n\r]+/g,'<br/>'));
  });

  // Whenever the server emits 'typing', show the typing message
  socket.on('newLines', (data) => {
    $lines.html($lines.html()+"</br>"+data.replace(/[\n\r]+/g,'<br/>'));
  });
});

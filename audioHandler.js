(function () {
	/**
	 * AudioHandler
	 * constructor
	 */
	function AudioHandler() {
		var self = this;
		try {
			// Fix up for prefixing
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			self.context = new AudioContext();
			// web audio api mode
			self.mode = 'waa';
			// cache buffer
			self.bufferList = {};
		} catch (e) {
			// html5 audio mode
			self.mode = 'html';
		}
	}
	/**
	 * play audio
	 * @param {String} url file_url
	 */
	AudioHandler.prototype.play = function (url) {
		var self = this;
		if (self.mode == 'waa') {
			var buffer = self.bufferList[url];
			if (buffer) {
				self.connect(buffer).start(0);
			} else {
				self.load(url);
			}
		} else {
			self.playByHTML(url);
			console.debug('Web Audio API is not supported in this browser');
		}
	};
	/**
	 * load audio
	 * @param {String} url file_url
	 */
	AudioHandler.prototype.load = function (url) {
		var self = this;
		// load file by XHR
		var request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.responseType = "arraybuffer";
		request.onload = function () {
			var self = this;
			var context = self.context;
			// Asynchronously decode the audio file data in request.response
			context.decodeAudioData(
				request.response,
				function (buffer) {
					var self = this;
					if (!buffer) {
						console.error('error decoding file data: ' + url);
						return;
					}
					self.bufferList[url] = buffer;
					self.play(url);
				}.bind(self),
				function (error) {
					var self = this;
					self.playByHTML(url);
					console.error('decodeAudioData error', error);
				}.bind(self)
			);
		}.bind(self)

		request.onerror = function () {
			var self = this;
			self.playByHTML(url);
			console.error('BufferLoader: XHR error');
		}.bind(self)

		request.send();
	};
	/**
	 * connect to audio buffer
	 * @param   {Object} buffer audio_buffer
	 * @returns {Object} audio source
	 */
	AudioHandler.prototype.connect = function (buffer) {
		var self = this;
		var context = self.context;
		var source = context.createBufferSource();
		source.buffer = buffer;
		source.connect(context.destination);
		return source;
	};
	/**
	 * play audio by using html5 audio
	 * @param {String} url file_url
	 */
	AudioHandler.prototype.playByHTML = function (url) {
		$('<audio />').attr('src', url).attr('volume', 0.5).get(0).play();
	};
	
	// expose AudioHandler to window
	window.AudioHandler = new AudioHandler();
})();
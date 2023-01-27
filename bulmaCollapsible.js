class EventEmitter {
	constructor(listeners = []) {
		this._listeners = new Map(listeners);
		this._middlewares = new Map();
	}

	listenerCount(eventName) {
		if (!this._listeners.has(eventName)) {
			return 0;
		}

		const eventListeners = this._listeners.get(eventName);
		return eventListeners.length;
	}

	removeListeners(eventName = null, middleware = false) {
		if (eventName !== null) {
			if (Array.isArray(eventName)) {
				name.forEach(e => this.removeListeners(e, middleware));
			} else {
				this._listeners.delete(eventName);

				if (middleware) {
					this.removeMiddleware(eventName);
				}
			}
		} else {
			this._listeners = new Map();
		}
	}

	middleware(eventName, fn) {
		if (Array.isArray(eventName)) {
			name.forEach(e => this.middleware(e, fn));
		} else {
			if (!Array.isArray(this._middlewares.get(eventName))) {
				this._middlewares.set(eventName, []);
			}

			(this._middlewares.get(eventName)).push(fn);
		}
	}

	removeMiddleware(eventName = null) {
		if (eventName !== null) {
			if (Array.isArray(eventName)) {
				name.forEach(e => this.removeMiddleware(e));
			} else {
				this._middlewares.delete(eventName);
			}
		} else {
			this._middlewares = new Map();
		}
	}

	on(name, callback, once = false) {
		if (Array.isArray(name)) {
			name.forEach(e => this.addEventListener(e, callback));
		} else {
			name = name.toString();
			const split = name.split(/,|, | /);

			if (split.length > 1) {
				split.forEach(e => this.addEventListener(e, callback));
			} else {
				if (!Array.isArray(this._listeners.get(name))) {
					this._listeners.set(name, []);
				}

				(this._listeners.get(name)).push({once: once, callback: callback});
			}
		}
	}

	once(name, callback) {
		this.addEventListener(name, callback, true);
	}

	emit(name, data, silent = false) {
		name = name.toString();
		let listeners = this._listeners.get(name);
		let middlewares = null;
		let doneCount = 0;
		let execute = silent;

		if (Array.isArray(listeners)) {
			listeners.forEach((listener, index) => {
				// Start Middleware checks unless we're doing a silent emit
				if (!silent) {
					middlewares = this._middlewares.get(name);
					// Check and execute Middleware
					if (Array.isArray(middlewares)) {
						middlewares.forEach(middleware => {
							middleware(data, (newData = null) => {
								if (newData !== null) {
									data = newData;
								}
								doneCount++;
							}, name);
						});

						if (doneCount >= middlewares.length) {
							execute = true;
						}
					} else {
						execute = true;
					}
				}

				// If Middleware checks have been passed, execute
				if (execute) {
					if (listener.once) {
						listeners[index] = null;
					}
					listener.callback(data);
				}
			});

			// Dirty way of removing used Events
			while (listeners.indexOf(null) !== -1) {
				listeners.splice(listeners.indexOf(null), 1);
			}
		}
	}
}

const isFunction = unknown => typeof unknown === 'function';
const isString = unknown => (typeof unknown === 'string' || ((!!unknown && typeof unknown === 'object') && Object.prototype.toString.call(unknown) === '[object String]'));
const isDate = unknown => (Object.prototype.toString.call(unknown) === '[object Date]' || unknown instanceof Date) && !isNaN(unknown.valueOf());
const isObject = unknown => ((typeof unknown === 'function' || (typeof unknown === 'object' && !!unknown)) && !Array.isArray(unknown));
const isNode = unknown => {
	try {
		Node.protocloneNode.call(unknown, false);
		return true;
	} catch (err) {
		return false;
	}
};
const isNodeList = unknown => NodeList.isPrototypeOf(unknown);
const falsy = /^(?:f(?:alse)?|no?|0+)$/i;
const BooleanParse = function (val) {
	return !falsy.test(val) && !!val;
};


 const uuid = (prefix = '') => prefix + ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));

 const ready = handler => {
	if (typeof document !== 'undefined') {
		if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
			handler();
		} else {
			document.addEventListener('DOMContentLoaded', handler, false);
		}
	} else {
		handler.apply();
	}
};

 const detectSupportsPassive = () => {
	let supportsPassive = false;

	if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
		let opts = Object.defineProperty({}, 'passive', {
			get() {
				supportsPassive = true;
				return true;
			}
		});

		const noop = () => { };
		window.addEventListener('testPassive', noop, opts);
		window.removeEventListener('testPassive', noop, opts);
	}

	return supportsPassive;
};


 const whichTransitionEvent = () => {
	const el = document.createElement('fakeelement');

	var transitions = {
		'transition': 'transitionend',
		'OTransition': 'oTransitionEnd',
		'MozTransition': 'transitionend',
		'WebkitTransition': 'webkitTransitionEnd'
	};

	for (let key in transitions) {
		if (el.style[key] !== undefined) {
			return transitions[key];
		}
	}
};


const defaultOptions = {
	allowMultiple: false,
	container: typeof document !== 'undefined' ? document : null
};

const querySelector = (selector, node) => {
	if (isFunction(selector)) {
		return querySelector(selector(), node);
	}

	if (isNode(selector)) {
		return selector;
	}

	if (isString(selector)) {
		if (node && isNode(node)) {
			return node.querySelector(selector);
		} else {
			if (typeof document !== 'undefined') {
				return document.querySelector(selector);
			} else {
				return null;
			}
		}
	}

	if (Array.isArray(selector) || isNodeList(selector)) {
		return selector[0];
	}
};
 const querySelectorAll = (selector, node) => {
	if (isFunction(selector)) {
		return selector(node ? node : (typeof document !== 'undefined' ? document : null));
	}

	if (isString(selector)) {
		if (node && isNode(node)) {
			return node.querySelectorAll(selector);
		} else {
			if (typeof document !== 'undefined') {
				return document.querySelectorAll(selector);
			} else {
				return null;
			}
		}
	}

	if (isNode(selector)) {
		return [selector];
	}

	if (isNodeList(selector)) {
		return selector;
	}

	return null;
};

 const optionsFromDataset = (node, defaultOptions = {}) => {
	if (isNode(node)) {
		return node.dataset ? Object.keys(node.dataset)
			.filter(key => Object.keys(defaultOptions).includes(key))
			.reduce((obj, key) => {
				return {
					...obj,
					[key]: node.dataset[key]
				};
			}, {}) : {};
	} else {
		return {};
	}
};

if (typeof Node !== 'undefined' && !Node.protoon) {
	Node.protoon = function (names, handler) {
		if (!Array.isArray(names)) {
			names = names.split(' ');
		}

		names.forEach(name => {
			this.addEventListener(name.trim(), handler, detectSupportsPassive() ? {
				passive: false
			} : false);
		});

		return this;
	};
}

if (typeof NodeList !== 'undefined' && !NodeList.protoon) {
	NodeList.protoon = function (names, handler) {
		this.forEach(node => {
			node.addEventListener(names, handler);
		});

		return this;
	};
}

if (typeof Node !== 'undefined' && !Node.protooff) {
	Node.protooff = function (names, handler) {
		if (!Array.isArray(names)) {
			names = names.split(' ');
		}

		names.forEach(name => {
			this.removeEventListener(name.trim(), handler, detectSupportsPassive() ? {
				passive: false
			} : false);
		});

		return this;
	};
}

if (typeof NodeList !== 'undefined' && !NodeList.protooff) {
	NodeList.protooff = function (names, handler) {
		this.forEach(node => {
			node.off(names, handler);
		});

		return this;
	};
}

class Component extends EventEmitter {
	constructor(element, options = {}, defaultOptions = {}) {
		super();

		this.element = isString(element) ? querySelector(element) : element;

		// An invalid selector or non-DOM node has been provided.
		if (!this.element) {
			throw new Error(`An invalid selector or non-DOM node has been provided for ${this.constructor.name}.`);
		}

		this.element[this.constructor.name] = this.constructor._interface.bind(this);
		this.element[this.constructor.name].Constructor = this.constructor.name;
		this.id = uuid(this.constructor.name + '-');

		this.options = {
			...defaultOptions,
			...options,
			...optionsFromDataset(this.element, defaultOptions) // Use Element dataset values to override options
		};
	}

	/**
	 * Initiate all DOM element corresponding to selector
	 * @method
	 * @return {Array} Array of all Plugin instances
	 */
	static attach(selector = null, options = {}, defaultOptions = {}) {
		let instances = new Array();
		if (selector === null) {
			return instances;
		}

		options = {
			...defaultOptions,
			...options,
			...optionsFromDataset(this.element, defaultOptions) // Use Element dataset values to override options
		};

		const elements = querySelectorAll(selector, options.container) || [];
		elements.forEach(element => {
			// Check if plugin has already been instantiated for element
			if (typeof element[this.constructor.name] === 'undefined') { // If no then instantiate it and register it in element
				instances.push(new this(element, {
					selector: selector,
					...options
				}));
			} else { // If Yes then return the existing instance
				instances.push(element[this.constructor.name]);
			}
		});

		return instances;
	}

	static _interface(options = {}) {
		if (typeof options === 'string') {
			if (typeof this[options] === 'undefined') {
				throw new TypeError(`No method named "${options}"`);
			}

			return this[options](options);
		}

		return this;
	}
}


class bulmaCollapsible extends Component {
	constructor(element, options = {}) {
		super(element, options, defaultOptions);

		//Bind events to current class
		this.onTriggerClick = this.onTriggerClick.bind(this);
		this.onTransitionEnd = this.onTransitionEnd.bind(this);

		// Initiate plugin
		this._init();
	}

	/**
	 * Initiate all DOM element corresponding to selector
	 * @method
	 * @return {Array} Array of all Plugin instances
	 */
	static attach(selector = '.is-collapsible', options = {}) {
		return super.attach(selector, options, defaultOptions);
	}

	/**
	 * Initiate plugin
	 * @method init
	 * @return {void}
	 */
	_init() {
		// Save original element height
		this._originalHeight = this.element.style.height;

		this._parent = this.element.dataset.parent;
		if (this._parent) {
			const parent = this.options.container.querySelector(`#${this._parent}`);
			this._siblings = querySelectorAll(this.options.selector, parent) || [];
		}

		this._triggers = this.options.container.querySelectorAll(`[data-action="collapse"][href="#${this.element.id}"], [data-action="collapse"][data-target="${this.element.id}"]`) || null;
		if (this._triggers) {
			this._triggers.forEach((nd) => nd.addEventListener('click', this.onTriggerClick));
		}

		this._transitionEvent = whichTransitionEvent();
		if (this._transitionEvent) {
			this.element.addEventListener(this._transitionEvent, this.onTransitionEnd);
		}

		// Set initial state
		if (this.element.classList.contains('is-active')) {
			this.expand();
		}  else {
			this.collapse();
		}
	}

	destroy() {
		// Unbind all event listener from triggers
		if (this._triggers) {
			this._triggers.off('click touch', this.onTriggerClick, false);
		}
	}

	/**
	 * Check is element is collapsed
	 * @method init
	 * @return {Boolean} true if element is collapsed(closed) else false
	 */
	collapsed() {
		return this._collapsed;
	}

	/**
	 * Expand(Open) element
	 * @method init
	 * @return {void}
	 */
	expand() {
		if (typeof this._collapsed !== 'undefined' && !this._collapsed) {
			return;
		}

		this.emit('before:expand', this);

		this._collapsed = false;

		// Close all siblings (based on data-parent attribute) if allowMultiple option set to False
		if (this._parent && !BooleanParse(this.options.allowMultiple)) {
			this._siblings.forEach(sibling => {
				if (!sibling.isSameNode(this.element)) {
					if (sibling.bulmaCollapsible) {
						sibling.bulmaCollapsible('close');
					}
				}
			});
		}

		// Apply style to show (expand) collapsible element
		this.element.style.height = this.element.scrollHeight + 'px';
		this.element.classList.add('is-active');
		this.element.setAttribute('aria-expanded', true);

		// Add 'is-active" class to all triggers
		if (this._triggers) {
			this._triggers.forEach(trigger => {
				trigger.classList.add('is-active');
			});
		}

		this.emit('after:expand', this);
	}

	/**
	 * Shortcut to expand method
	 */
	open()
	{
		this.expand();
	}

	/**
	 * Collapse(Close) element
	 * @method init
	 * @return {void}
	 */
	collapse() {
		if (typeof this._collapsed !== 'undefined' && this._collapsed) {
			return;
		}

		this.emit('before:collapse', this);

		this._collapsed = true;

		// Apply style to hide (collapse) collapsible element
		this.element.style.height = 0;
		this.element.classList.remove('is-active');
		this.element.setAttribute('aria-expanded', false);

		// Remove 'is-active" class from all triggers
		if (this._triggers) {
			this._triggers.forEach(trigger => {
				trigger.classList.remove('is-active');
			});
		}

		this.emit('after:collapse', this);
	}

	/**
	 * Shortcut to collapse method
	 */
	close()
	{
		this.collapse();
	}

	/**
	 * Trigger listener to Toggle element state
	 * @method init
	 * @param {event} event
	 * @return {void}
	 */
	onTriggerClick(event) {
		event.preventDefault();

		if (this.collapsed()) {
			event.currentTarget.classList.add('is-active');
			this.expand();
		} else {
			event.currentTarget.classList.remove('is-active');
			this.collapse();
		}
	}

	/**
	 * Listener on CSS transition end
	 * @param {event} event
	 * @return {void}
	 */
	onTransitionEnd(event) {
		if (!this._collapsed) {
			//this.element.style.height = this._originalHeight;
		}
	}
}

export default bulmaCollapsible;

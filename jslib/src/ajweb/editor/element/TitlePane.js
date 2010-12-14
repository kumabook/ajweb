dojo.provide("ajweb.editor.element.TitlePane");

dojo.require("dojo.fx");

dojo.require("dijit._Templated");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit._CssStateMixin");

dojo.declare(
	"ajweb.editor.element.TitlePane",
	[dijit.layout.ContentPane, dijit._Templated, dijit._CssStateMixin],
{
  constructor: function(opt){
    this.width = opt.width;
    this.height = opt.height;
    console.log(this.height);
  },
	title: "",

	// open: Boolean
	//		Whether pane is opened or closed.
	open: true,

	// toggleable: Boolean
	//		Whether pane can be opened or closed by clicking the title bar.
	toggleable: true,

	// tabIndex: String
	//		Tabindex setting for the title (so users can tab to the title then
	//		use space/enter to open/close the title pane)
	tabIndex: "0",

	// duration: Integer
	//		Time in milliseconds to fade in/fade out
	duration: 500,//dijit.defaultDuration,

	// baseClass: [protected] String
	//		The root className to be placed on this widget's domNode.
	baseClass: "dijitTitlePane",

	templateString: dojo.cache("ajweb.editor.element", "templates/TitlePane.html"),

	attributeMap: dojo.delegate(dijit.layout.ContentPane.prototype.attributeMap, {
		title: { node: "titleNode", type: "innerHTML" },
		tooltip: {node: "focusNode", type: "attribute", attribute: "title"},	// focusNode spans the entire width, titleNode doesn't
		id:""
	}),

	postCreate: function(){
	  this.containerNode.style.display = "none";
	  this.titleBarNode.style.height = "20px";
	  if(!this.open){
	    this.hideNode.style.display = this.wipeNode.style.display = "none";
	  }
//	  this.hideNode.style.height = this.height +"px";
//	  this.hideNode.style.width = this.width +"px";
	  if(this.toggleable){
	    this._trackMouseState(this.titleBarNode, "dijitTitlePaneTitle");
	  }
	  this._setCss();
	  dojo.setSelectable(this.titleNode, false);


	  this._wipeIn = dojo.animateProperty(
	    {
	      node: this.domNode,
	      duration: this.duration,
	      properties: {
		height: {start: 20, end: this.height},
		width: {start: 100, end: this.width}
	      }
	    });
	  this._wipeOut =  dojo.animateProperty(
	    {
	      node: this.domNode,
	      duration: this.duration,
	      properties: {
		height: {start: this.height, end: 20},
		width: {start: this.width, end: 100}
	      }
	    });
	  this.inherited(arguments);
	},

	_setOpenAttr: function(/* Boolean */ open){

		if(this.open !== open){ this.toggle(); }
		dijit.setWaiState(this.containerNode,"hidden", this.open ? "false" : "true");
		dijit.setWaiState(this.focusNode, "pressed", this.open ? "true" : "false");
	},

	_setToggleableAttr: function(/* Boolean */ canToggle){

		this.toggleable = canToggle;
		dijit.setWaiRole(this.focusNode, canToggle ? "button" : "heading");
		if(canToggle){
			// TODO: if canToggle is switched from true false shouldn't we remove this setting?
			dijit.setWaiState(this.focusNode, "controls", this.id+"_pane");
			dojo.attr(this.focusNode, "tabIndex", this.tabIndex);
		}
		else{
			dojo.removeAttr(this.focusNode, "tabIndex");
		}
		this._setCss();
	},

	_setContentAttr: function(content){
		// summary:
		//		Hook to make attr("content", ...) work.
		// 		Typically called when an href is loaded.  Our job is to make the animation smooth.

		if(!this.open || !this._wipeOut || this._wipeOut.status() == "playing"){
			// we are currently *closing* the pane (or the pane is closed), so just let that continue
			this.inherited(arguments);
		}else{
			if(this._wipeIn && this._wipeIn.status() == "playing"){
				this._wipeIn.stop();
			}

			// freeze container at current height so that adding new content doesn't make it jump
			dojo.marginBox(this.wipeNode, { h: dojo.marginBox(this.wipeNode).h });

			// add the new content (erasing the old content, if any)
			this.inherited(arguments);

			// call _wipeIn.play() to animate from current height to new height
			if(this._wipeIn){
				this._wipeIn.play();
			}else{
				this.hideNode.style.display = "";
			}
		}
	},

	toggle: function(){
		// summary:
		//		Switches between opened and closed state
		// tags:
		//		private

		dojo.forEach([this._wipeIn, this._wipeOut], function(animation){
			if(animation && animation.status() == "playing"){
				animation.stop();
			}
		});

		var anim = this[this.open ? "_wipeOut" : "_wipeIn"];
		if(anim){
			anim.play();
		}else{
			this.hideNode.style.display = this.open ? "" : "none";
		}
		this.open =! this.open;

		// load content (if this is the first time we are opening the TitlePane
		// and content is specified as an href, or href was set when hidden)
		if(this.open){
			this._onShow();
		}else{
			this.onHide();
		}

		this._setCss();
	},

	_setCss: function(){
		// summary:
		//		Set the open/close css state for the TitlePane
		// tags:
		//		private

		var node = this.titleBarNode || this.focusNode;
	  
		if(this._titleBarClass){
			dojo.removeClass(node, this._titleBarClass);
		}
		this._titleBarClass = "dijit" + (this.toggleable ? "" : "Fixed") + (this.open ? "Open" : "Closed");
		dojo.addClass(node, this._titleBarClass);
		this.arrowNodeInner.innerHTML = this.open ? "-" : "+";
	},

	_onTitleKey: function(/*Event*/ e){
		// summary:
		//		Handler for when user hits a key
		// tags:
		//		private

		if(e.charOrCode == dojo.keys.ENTER || e.charOrCode == ' '){
			if(this.toggleable){
				this.toggle();
			}
			dojo.stopEvent(e);
		}else if(e.charOrCode == dojo.keys.DOWN_ARROW && this.open){
			this.containerNode.focus();
			e.preventDefault();
	 	}
	},

	_onTitleClick: function(){
		// summary:
		//		Handler when user clicks the title bar
		// tags:
		//		private
		if(this.toggleable){
			this.toggle();
		}
	},

	setTitle: function(/*String*/ title){
		// summary:
		//		Deprecated.  Use set('title', ...) instead.
		// tags:
		//		deprecated
		dojo.deprecated("dijit.TitlePane.setTitle() is deprecated.  Use set('title', ...) instead.", "", "2.0");
		this.set("title", title);
	}
});

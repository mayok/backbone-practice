$(function() {
  var Page = Backbone.Model.extend({
    idAttributes: "id",

    defaults: function() {
      return {
        title    : "",
        tag      : "",
        content  : ""
      };
    },

    urlRoot: "page.json",

    validate: function (attributes) {
      if(attributes.title === "") {
        return "title must not be empty.";
      }
    }
  });

  var Pages = Backbone.Collection.extend({
    model : Page,
    url   : "pages.json",

    parse: function (res) {
      if(res.error) {
        console.log(res.error.message);
      }
      return res.list;
    }
  });

  var PageView = Backbone.View.extend({
    el: $('#main'),

    initialize: function () {
      _.bindAll(this, "render");
      this.model = new Page();
      this.model.fetch({
        success: $.proxy(this.render, this),
        error:   $.proxy(this.error, this)
      });
    },

    render: function (item) {
      var page = {
        title: this.model.get('title'),
        content: this.model.get('content')
      };
      this.$el.append(this.template(page));
    },
    error: function () {
      console.log("error");
    },
    template: _.template("<li><%= title %></li> <li><%= content %></li>")
  })

  var PagesView = Backbone.View.extend({
    el: $('#main'),

    initialize: function () {
      _.bindAll(this, "render", "appendItem");
      this.collection = new Pages();
      this.collection.fetch({
        success: $.proxy(this.render, this),
        error:   $.proxy(this.error, this)
      });

    },

    render: function () {
      _(this.collection.models).each(function (item) {
        this.appendItem(item);
      }, this);
    },

    appendItem: function (item) {
      var page = {
        title: item.get('title'),
        tag: item.get('tag')
      };
      this.$el.append(this.template(page));
    },
    error: function () {
      this.$el.append(this.template({title: 'error'}));
    },
    template: _.template("<li><%= title %></li> <li><%= tag %></li>")
  });

  var HeaderView = Backbone.View.extend({
    events: {
      "click #create" : "onCreate",
      "click #edit"   : "onEdit"
    },
    onCreate: function () {
      router.navigate("create", { trigger: true });
    },
    onEdit: function () {
      router.navigate("edit", { trigger: true });
    },

  });

  var Router = Backbone.Router.extend({
    routes: {
      ''         : 'index',
      'page/:id' : 'show',
      'edit/:id' : 'edit',
      'create'   : 'create',
    },
    initialize: function () {
      this.headerview = new HeaderView({ el: $('#header') });
    },

    index: function() {
      console.log('index', arguments);
      this.indexview = new PagesView();
    },

    show: function (id) {
      console.log('page' + id, arguments);
      this.showview = new PageView();
    },

    edit: function (id) {
      console.log('edit' + id, arguments);
    },

    create: function () {
      console.log('create', arguments);
    }
  });

  var router = new Router();
  Backbone.history.start();
});

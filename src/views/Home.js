﻿/// <reference path="../../../ext/ext-core-debug.js"/>
/// <reference path="../../../reui/reui.js"/>
/// <reference path="../../../platform/View.js"/>
/// <reference path="Application.js"/>

Ext.namespace("Mobile.SalesLogix");

/// this is a very simple home view.
Mobile.SalesLogix.Home = Ext.extend(Sage.Platform.Mobile.View, {
    titleText: 'Home',
    itemTemplate: new Simplate([
        '<li>',
        '<a href="#{%= id %}" target="_view">',
        '{% if ($["icon"]) { %}',
        '<img src="{%= $["icon"] %}" alt="icon" class="icon" />',
        '{% } %}',
        '{%= title %}',
        '</a>',
        '</li>'
    ]),
    constructor: function(o) {
        Mobile.SalesLogix.Home.superclass.constructor.call(this);

        Ext.apply(this, o, {
            id: 'home',
            title: this.titleText
        });
    },
    render: function() {
        Mobile.SalesLogix.Home.superclass.render.call(this);

        var v = App.getViews();
        var o = [];
        for (var i = 0; i < v.length; i++)
            if (v[i] != this && v[i].expose != false)
                o.push(this.itemTemplate.apply(v[i]));

        Ext.DomHelper.append(this.el, o.join(''));
    },
    init: function() {
        Mobile.SalesLogix.Home.superclass.init.call(this);

        this.el
            .on('click', function(evt, el, o) {
                var source = Ext.get(el);
                var target;

                if (source.is('a[target="_view"]') || (target = source.up('a[target="_view"]')))
                    this.navigateToView(target || source, evt);

            }, this, { preventDefault: true, stopPropagation: true });

        App.on('registered', this.viewRegistered, this);
    },
    navigateToView: function(el) {
        if (el)
        {
            var id = el.dom.hash.substring(1);
            var view = App.getView(id);
            if (view)
                view.show();
        }
    },
    viewRegistered: function(view) {
        Ext.DomHelper.append(this.el, this.itemTemplate.apply(view));
    }
});
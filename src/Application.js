/// <reference path="../../ext/ext-core-debug.js"/>
/// <reference path="../../platform/Application.js"/>
/// <reference path="../../sdata/SDataService.js"/>

Ext.namespace("Mobile.SalesLogix");

Mobile.SalesLogix.Application = Ext.extend(Sage.Platform.Mobile.Application, {
    defaultVirtualDirectory: 'sdata',
    defaultApplicationName: 'slx',
    defaultContractName: 'dynamic',
    titleText: 'Mobile Demo',
    constructor: function (o) {
        Mobile.SalesLogix.Application.superclass.constructor.call(this);

        Ext.apply(this, o, {
            enableCaching: true
        });
    },
    init: function() {
        Mobile.SalesLogix.Application.superclass.init.call(this);

        var home = App.getView('home');
        Ext.get("backButton").on("longpress", function() {

            if (home) {
                home.show();
            }
        });
        this.fetchPreferences();
    },
    run: function() {
        if (App.isOnline() || !App.enableCaching)
        {
            var login = App.getView('login');
            if (login)
                login.show();
        }
    },
    fetchPreferences: function() {
        var views = this.getExposedViews();

        try {
            App.preferences = Ext.decode(window.localStorage.getItem('preferences'));
        }
        catch(e) {}

        //Probably, the first time, its being accessed, or user cleared
        //the data. So lets initialize the object, with default ones.
        if (App.preferences === null)
        {
            App.preferences = {};

            App.preferences.home = {
                visible: views
            };

            //Just create a clone of views, we don't want the same reference
            App.preferences.configure = {
                order: Ext.decode(Ext.encode(views))
            };
        }
    },
    persistPreferences: function() {
        try {
            window.localStorage.setItem('preferences', Ext.encode(App.preferences));
        }
        catch(e) {}
    },
    getExposedViews : function() {
        var exposedViews = [],
            view;

        for (var v in this.views)
        {
            view = App.getView(v);
            if (view.expose != false && view.id != 'home')
                exposedViews.push(v);
        }

        return exposedViews;
    },
    getMatchingContext : function(contexts, depth) {
        var context;

        for (var i = 0; i < contexts.length; i++)
        {
            context = this.queryNavigationContext(function(o) {
                return (o.resourceKind === contexts[i]) && o.key;
            }, depth);
            if (context) break;
        }

        return context;
    },
    setup: function () {
        Mobile.SalesLogix.Application.superclass.setup.apply(this, arguments);

        this.registerToolbar(new Sage.Platform.Mobile.MainToolbar({
            name: 'tbar',
            title: this.titleText
        }));

        this.registerToolbar(new Sage.Platform.Mobile.FloatToolbar({
            name: 'fbar'
        }));
        this.registerView(new Sage.Platform.Mobile.Calendar());
        
        this.registerView(new Mobile.SalesLogix.Login());
        this.registerView(new Mobile.SalesLogix.Home());
        this.registerView(new Mobile.SalesLogix.Configure());
        this.registerView(new Mobile.SalesLogix.PickList());
        this.registerView(new Mobile.SalesLogix.SelectList());
        this.registerView(new Mobile.SalesLogix.ContextDialog());
        this.registerView(new Mobile.SalesLogix.AddAccountContact());
        
        this.registerView(new Mobile.SalesLogix.NameEdit());
        this.registerView(new Mobile.SalesLogix.Address.Edit());

        this.registerView(new Mobile.SalesLogix.Account.List());
        this.registerView(new Mobile.SalesLogix.Account.Detail());
        this.registerView(new Mobile.SalesLogix.Account.Edit());
        this.registerView(new Mobile.SalesLogix.Account.List({
            id: 'account_related',
            expose: false
        }));

        this.registerView(new Mobile.SalesLogix.Campaign.List({
            expose: false
        }));
        this.registerView(new Mobile.SalesLogix.Campaign.Detail());
        this.registerView(new Mobile.SalesLogix.Campaign.Edit());
        this.registerView(new Mobile.SalesLogix.Campaign.List({
            id: 'campaign_related',
            expose: false
        }));

        this.registerView(new Mobile.SalesLogix.Contact.Edit());
        this.registerView(new Mobile.SalesLogix.Contact.List());
        this.registerView(new Mobile.SalesLogix.Contact.Detail());
        this.registerView(new Mobile.SalesLogix.Contact.List({
            id: 'contact_related',
            expose: false
        }));

        this.registerView(new Mobile.SalesLogix.SalesOrder.Edit());
        this.registerView(new Mobile.SalesLogix.SalesOrder.List({
            expose: false
        }));
        this.registerView(new Mobile.SalesLogix.SalesOrder.Detail());
        this.registerView(new Mobile.SalesLogix.SalesOrder.List({
            id: 'salesorder_related',
            expose: false
        }));

        this.registerView(new Mobile.SalesLogix.Contract.Edit());
        this.registerView(new Mobile.SalesLogix.Contract.List({
            expose: false
        }));
        this.registerView(new Mobile.SalesLogix.Contract.Detail());
        this.registerView(new Mobile.SalesLogix.Contract.List({
            id: 'contract_related',
            expose: false
        }));

        this.registerView(new Mobile.SalesLogix.Opportunity.Edit());
        this.registerView(new Mobile.SalesLogix.Opportunity.List());
        this.registerView(new Mobile.SalesLogix.Opportunity.Detail());
        this.registerView(new Mobile.SalesLogix.Opportunity.List({
            id: 'opportunity_related',
            expose: false
        }));

        this.registerView(new Mobile.SalesLogix.Lead.Edit());
        this.registerView(new Mobile.SalesLogix.Lead.List());
        this.registerView(new Mobile.SalesLogix.Lead.Detail());
        this.registerView(new Mobile.SalesLogix.Lead.List({
            id: 'lead_related',
            expose: false
        }));

        this.registerView(new Mobile.SalesLogix.Return.List({
            expose: false
        }));
        this.registerView(new Mobile.SalesLogix.Return.Detail());
        this.registerView(new Mobile.SalesLogix.Return.Edit());
        this.registerView(new Mobile.SalesLogix.Return.List({
            id: 'return_related',
            expose: false
        }));

        this.registerView(new Mobile.SalesLogix.Ticket.List());
        this.registerView(new Mobile.SalesLogix.Ticket.Detail());
        this.registerView(new Mobile.SalesLogix.Ticket.Edit());
        this.registerView(new Mobile.SalesLogix.Ticket.List({
            id: 'ticket_related',
            expose: false
        }));

        this.registerView(new Mobile.SalesLogix.Activity.Detail());
        this.registerView(new Mobile.SalesLogix.Activity.Edit());
        this.registerView(new Mobile.SalesLogix.Activity.TypesList());
        this.registerView(new Mobile.SalesLogix.Activity.List({
            id: 'activity_related',
            expose: false
        }));

        this.registerView(new Mobile.SalesLogix.Defect.List({
            expose: false
        }));
        this.registerView(new Mobile.SalesLogix.Defect.Detail());
        this.registerView(new Mobile.SalesLogix.Defect.Edit());
        this.registerView(new Mobile.SalesLogix.Defect.List({
            id: 'defect_related',
            expose: false
        }));

        this.registerView(new Mobile.SalesLogix.DefectProblem.Detail());
        this.registerView(new Mobile.SalesLogix.DefectProblem.Edit());
        this.registerView(new Mobile.SalesLogix.DefectProblem.Detail({
            id: 'defectproblem_related',
            expose: false
        }));

        this.registerView(new Mobile.SalesLogix.DefectSolution.Detail());
        this.registerView(new Mobile.SalesLogix.DefectSolution.Edit());
        this.registerView(new Mobile.SalesLogix.DefectSolution.Detail({
            id: 'defectsolution_related',
            expose: false
        }));

        this.registerView(new Mobile.SalesLogix.Note.Detail());
        this.registerView(new Mobile.SalesLogix.Note.Edit());
        this.registerView(new Mobile.SalesLogix.Note.List({
            id: 'note_related',
            expose: false
        }));

        this.registerView(new Mobile.SalesLogix.User.List({
            expose: false
        }));

        this.registerView(new Mobile.SalesLogix.Owner.List({
            expose: false
        }));

        this.registerView(new Mobile.SalesLogix.LeadSource.List({
            expose: false
        }));

        this.registerView(new Mobile.SalesLogix.Account.Lookup({
            expose: false
        }));

        this.registerView(new Mobile.SalesLogix.Contact.Lookup({
            expose: false
        }));
    },
    navigateToHomeView: function() {
        var view = this.getView('home');
        if (view)
            view.show();
    },
    navigateToActivityInsertView: function() {
        var view = this.getView('activity_edit');
        if (view)
            view.show({insert: true});
    }
});

// instantiate application instance
var App = new Mobile.SalesLogix.Application();
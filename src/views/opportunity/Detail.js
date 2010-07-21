﻿/// <reference path="../../../../ext/ext-core-debug.js"/>
/// <reference path="../../../../Simplate.js"/>
/// <reference path="../../../../sdata/SDataSingleResourceRequest.js"/>
/// <reference path="../../../../sdata/SDataService.js"/>
/// <reference path="../../../../platform/View.js"/>
/// <reference path="../../../../platform/Detail.js"/>
/// <reference path="../../Format.js"/>
/// <reference path="../../Template.js"/>

Ext.namespace("Mobile.SalesLogix.Opportunity");

Mobile.SalesLogix.Opportunity.Detail = Ext.extend(Sage.Platform.Mobile.Detail, {       
    constructor: function(o) {
        Mobile.SalesLogix.Opportunity.Detail.superclass.constructor.call(this);        
        
        Ext.apply(this, o, {
            id: 'opportunity_detail',
            title: 'Opportunity',
	    editor: 'opportunity_edit',	
            resourceKind: 'opportunities'
        });

        this.layout = [
            {name: 'Description', label: 'opportunity'},
            {name: 'Account.AccountName', label: 'account', view: 'account_detail', key: 'Account.$key', property: true},
            {name: 'EstimatedClose', label: 'est. close', renderer: Mobile.SalesLogix.Format.date},
            {name: 'SalesPotential', label: 'potential', renderer: Mobile.SalesLogix.Format.currency},
            {name: 'CloseProbability', label: 'probability'},
            {name: 'Weighted', label: 'weighted', renderer: Mobile.SalesLogix.Format.currency},
            {name: 'Stage', label: 'stage'},
            {name: 'AccountManager.UserInfo', label: 'acct mgr', tpl: Mobile.SalesLogix.Template.nameLF},
            {name: 'Owner.OwnerDescription', label: 'owner'},
            {name: 'Status', label: 'status'},
            {name: 'CreateUser', label: 'create user'},  
            {name: 'CreateDate', label: 'create date', renderer: Mobile.SalesLogix.Format.date},
      
            {options: {title: 'Related Items', list: true}, as: [                
                {
                    view: 'activity_related', 
                    where: this.formatRelatedQuery.createDelegate(this, ['OpportunityId eq "{0}"'], true),
                    label: 'Activities',
                    icon: 'content/images/Task_List_3D_24x24.gif'
                },
                {
                    view: 'note_related', 
                    where: this.formatRelatedQuery.createDelegate(this, ['OpportunityId eq "{0}" and Type eq "atNote"'], true),
                    label: 'Notes',
                    icon: 'content/images/note_24x24.gif'
                }
            ]}         
        ];
    },        
    formatAccountRelatedQuery: function(entry, fmt) {
        return String.format(fmt, entry['Account']['$key']);
    },
    init: function() {     
        Mobile.SalesLogix.Opportunity.Detail.superclass.init.call(this);   
    },
    createRequest: function() {
        var request = Mobile.SalesLogix.Opportunity.Detail.superclass.createRequest.call(this); 

        request            
            .setQueryArgs({
                'include': 'Account,AccountManager,AccountManager/UserInfo',                
                'select': [
                    'Description',
                    'Account/AccountName',
                    'EstimatedClose',
                    'SalesPotential',
                    'CloseProbability',
                    'Weighted',
                    'Stage',
                    'AccountManager/UserInfo/FirstName',
                    'AccountManager/UserInfo/LastName',
                    'Owner/OwnerDescription',
                    'Status',
                    'CreateDate',
                    'CreateUser'
                ].join(',')             
            });

        return request;
    } 
});

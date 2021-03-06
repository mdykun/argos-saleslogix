/// <reference path="../../../../../argos-sdk/libraries/ext/ext-core-debug.js"/>
/// <reference path="../../../../../argos-sdk/libraries/sdata/sdata-client-debug"/>
/// <reference path="../../../../../argos-sdk/libraries/Simplate.js"/>
/// <reference path="../../../../../argos-sdk/src/View.js"/>
/// <reference path="../../../../../argos-sdk/src/List.js"/>

Ext.namespace("Mobile.SalesLogix.Opportunity");

(function() {
    Mobile.SalesLogix.Opportunity.List = Ext.extend(Sage.Platform.Mobile.List, {
        //Templates
        contentTemplate: new Simplate([
            '<h3>{%: $.Account ? $.Account.AccountName : "" %}</h3>',
            '<h4>{%: $.Description %}</h4>'
        ]),

        //Localization
        titleText: 'Opportunities',

        //View Properties
        contextView: 'context_dialog',
        detailView: 'opportunity_detail',
        icon: 'content/images/Opportunity_List_24x24.gif',
        id: 'opportunity_list',
        insertView: 'opportunity_edit',
        queryOrderBy: 'Description',
        querySelect: [
            'Account/AccountName',
            'Description',
            'Stage'
        ],
        resourceKind: 'opportunities',

        formatSearchQuery: function(query) {
            return String.format('(Description like "%{0}%")', query);

            // todo: The below does not currently work as the dynamic SData adapter does not support dotted notation for queries
            //       except in certain situations.  Support for general dotted notation is being worked on.
            //return String.format('(Description like "%{0}%" or Account.AccountName like "%{0}%")', query);
        }
    });
})();
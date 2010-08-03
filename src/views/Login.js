Ext.namespace("Mobile.SalesLogix.Login");

Mobile.SalesLogix.Login = Ext.extend(Sage.Platform.Mobile.Edit, {
    titleText: "Login",
    userText: 'user',
    passText: 'pass',
    viewTemplate: new Simplate([            
        '<div id="{%= id %}" title="{%= title %}" class="panel" effect="flip">',  
        '<fieldset class="loading">',
        '<div class="row"><div class="loading-indicator">{%= loadingText %}</div></div>',
        '</fieldset>',
        '<div class="body" style="display: none;">',
        '</div>',           
        '<div class="login-button"><a class="whiteButton" href="#"><span>Login</span></a></div>',
        '</div>'
    ]),
    constructor: function(o) {
        Mobile.SalesLogix.Login.superclass.constructor.call(this);

        Ext.apply(this, o, {
            id: 'login_view',
            title: this.titleText
        });

        this.layout = [
            {name: 'user', label: this.userText, type: 'text'},
            {name: 'password', label: this.passText, type: 'text'}
        ];
        this.busy = false;
    },
    init: function() {
        Mobile.SalesLogix.Login.superclass.init.call(this);
        this.el
            .select(".login-button .whiteButton")
            .on('click', function(evt, el, o) {
                this.login();   
            }, this, { preventDefault: true, stopPropagation: true });
        
    },
    login: function () {
        if (this.busy) return;

        var username = this.el
            .child('input[name="user"]')
            .getValue();

        var password = this.el
            .child('input[name="password"]')
            .getValue();

        this.validateCredentials(username, password);
    },
    validateCredentials: function (username, password) {
        this.busy = true;
        this.el.addClass('dialog-busy');

        var service = App.getService()
            .setUserName(username)
            .setPassword(password);

        var request = new Sage.SData.Client.SDataResourceCollectionRequest(service)
            .setResourceKind('users')
            .setQueryArgs({
                'select': 'UserName',
                'where': String.format('UserName eq "{0}"', username)
            })
            .setCount(1)
            .setStartIndex(1);

        request.read({
            success: function (feed) {
                this.busy = false;
                this.el.removeClass('dialog-busy');

                if (feed['$resources'].length <= 0) {
                    service
                        .setUserName(false)
                        .setPassword(false);

                    alert('User does not exist.');
                }
                else {
                    App.context['user'] = feed['$resources'][0]['$key'];

                    // todo: add successful login eventing

                    //this.el.dom.removeAttribute('selected');
                    ReUI.show("home");
                }
            },
            failure: function (response, o) {
                this.busy = false;
                this.el.removeClass('dialog-busy');

                service
                    .setUserName(false)
                    .setPassword(false);

                if (response.status == 403)
                    alert('Username or password is invalid.');
                else
                    alert('A problem occured on the server.');
            },
            scope: this
        });
    }   
});
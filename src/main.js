function needAuth(to, from, next) {
    if (localStorage.getItem("user") === null) {
        next({
            path: '/login',
            component: Login,
        })
    } else {
        next()
    }
};
var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const Login = {
    template: '<div><p>Please, enter your username and password</p><input type="text" v-model="user.username" placeholder="username"><br/><input type="password" v-model="user.password" placeholder="password"><br/><button class="btn btn-unique btn-md" v-on:click="login()">Log in!</button><h3 v-show="error">{{error}}</h3></div>',
    data: function() {
        return {
            user: { username: '', password: '' },
            validuser: { username: 'admin', password: '123' },
            error: false
        }
    },
    methods: {
        login: function() {
            if (this.user.username == this.validuser.username && this.user.password == this.validuser.password) {
                this.loginSuccess();
            } else { this.loginError(); }
        },
        loginSuccess: function() {
            localStorage.setItem("user", this.user.username);
            this.$router.push('/admin');
        },
        loginError: function() {
            this.error = "Incorrect login or password!"
        }
    }
};
const Admin = {
    template: '<div><route-links></route-links></div>',
    data: function() {
        return {}
    },
    methods: {}
};
const Account = {
    template: '<div><route-links></route-links> <h3>Account info:</h3><h4>your name: {{username}} :))</h4></div>',

    data: function() {
        return {
            username: localStorage.getItem("user"),
        }
    },
    methods: {}
};
const Users = {
    template: '<div><route-links></route-links> <h3>Users:</h3>  <ul><li v-for="(user, index) in users" class="user"><span>{{user.name}} - {{user.email}}</span><button class="btn btn-unique btn-sm" v-on:click="editUser(user, index)">Edit</button><button class="btn btn-unique btn-sm" v-on:click="removeUser(user, index)">Delete</button><br/><div class="md-form" v-show="showHide(index)"><span> <input type="text" v-model="user.name"> <input type="email" v-model="user.email"></span><button class="btn btn-unique btn-sm" v-on:click="saveUser(user, index)">Save</button></div></li></ul><form id="form" v-on:submit.prevent="addUser"><input type="text" v-model="newUser.name" placeholder="username"><input type="email" v-model="newUser.email" placeholder="email@email.com"><input class="btn btn-unique btn-sm" type="submit" value="Add User"></form></div>',
    data: function() {
        return {
            newUser: {
                name: '',
                email: ''
            },
            users: JSON.parse(localStorage.getItem("users") || '[]'),
            editArray: [false, false]
        }
    },
    computed: {
        validation: function() {
            return {
                name: !!this.newUser.name.trim(),
                email: emailRE.test(this.newUser.email)
            }
        },
        isValid: function() {
            var validation = this.validation
            return Object.keys(validation).every(function(key) {
                return validation[key]
            })
        }
    },
    methods: {
        addUser: function() {
            if (this.isValid) {
                this.users.push(this.newUser);
                localStorage.setItem('users', JSON.stringify(this.users));
                this.users = JSON.parse(localStorage.getItem("users")) || [];
                this.newUser.name = ''
                this.newUser.email = ''
            }
        },
        removeUser: function(user, index) {
            this.users.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(this.users));
            this.users = JSON.parse(localStorage.getItem("users")) || [];
        },
        editUser: function(user, index) {
            this.editArray = [];
            this.editArray[index] = true;
            console.log(this.editArray);
        },
        saveUser: function(user, index) {
            localStorage.setItem('users', JSON.stringify(this.users));
            this.users = JSON.parse(localStorage.getItem("users")) || [];
            this.editArray = [];
        },
        showHide: function(index) {
            return this.editArray[index]
        }
    }

};
Vue.component("route-links", {
    template: '<nav class="navbar navbar-dark black "><div class="container"><ul class="nav navbar-nav  inline-navbar"><li class="nav-item active"><router-link class="btn btn-unique" to="/admin/users">Users</router-link></li>     <li class="nav-item"><router-link class="btn btn-unique" to="/admin/account">Account</router-link></li>    <li class="nav-item navbar-toggler-right"><button class="btn btn-unique" v-on:click="logout()">Log out</button></li></ul></div></nav>',
    data: function() {
        return {
            logout: function() {
                localStorage.removeItem("user");
                this.$router.push('/login');
            }
        }
    },
});
const routes = [
    { path: '/', component: Admin, beforeEnter: needAuth },
    { path: '/login', component: Login },
    { path: '/admin', component: Users, beforeEnter: needAuth },
    { path: '/admin/account', component: Account, beforeEnter: needAuth },
    { path: '/admin/users', component: Users, beforeEnter: needAuth }
];
const router = new VueRouter({
    routes
})
const App = new Vue({
    router
}).$mount('#app');

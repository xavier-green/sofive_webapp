Vue.component('sofive-left-menu', {
  template: `
        <div>
		<nav class="navbar-default navbar-static-side" role="navigation">
            <div class="sidebar-collapse">
                <ul class="nav metismenu" id="side-menu">
                    <li class="nav-header">
                        <div class="dropdown profile-element">
                        <a href="index.html"> <img alt="image" class="image" style="max-width: 150px"
                                :src="img" /> </a>
                            <a data-toggle="dropdown" class="dropdown-toggle" href="#">
                            <br/><br/>
                            <span class="text-muted text-xs block" style="color: white !important">Change center <b class="caret"></b></span>
                            </a>
                            <ul class="dropdown-menu animated fadeInRight m-t-xs">
                                <li><a class="dropdown-item" v-on:click="setCookie('1')">Sofive Meadowlands</a></li>
                                <li><a class="dropdown-item" v-on:click="setCookie('3')">Sofive Brooklyn</a></li>
                                <li><a class="dropdown-item" v-on:click="setCookie('4')">Sofive Rockville</a></li>
                                <li><a class="dropdown-item" v-on:click="setCookie('2')">Sofive Elkins-Park</a></li>
                                <li><a class="dropdown-item" v-on:click="setCookie('5')">Sofive Columbia</a></li>
                            </ul>
                            <ul>
                        </div>
                    </li>
                    <li>
                        <a href="standings.html"><i class="fa fa-trophy"></i><span class="nav-label">Schedule & standings</span></a>
                    </li>
                    <li>
                        <a href="search.html"><i class="fa fa-users"></i><span class="nav-label">Team</span></a>
                    </li>
                    <li>
                        <a href="video.html"><i class="fa fa-video-camera"></i><span class="nav-label">Videos</span></a>
                    </li>
                </ul>
            </div>
        </nav>
        <div class="modal inmodal fade" id="myModal5" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Select center location</h4>
                        <small class="font-bold">Please select your prefered location</small>
                    </div>
                    <div class="modal-body">
                        <label class="col-form-label" for="status">
                            <div v-if="facility_loading">
                                <div>
                                    <div class="sk-spinner sk-spinner-wave">
                                        <div class="sk-rect1"></div>
                                        <div class="sk-rect2"></div>
                                        <div class="sk-rect3"></div>
                                        <div class="sk-rect4"></div>
                                        <div class="sk-rect5"></div>
                                    </div>
                                </div>
                            </div>
                        </label>
                        <select class="select_season form-control" v-model="selected.center">
                            <option value="0">Pick a location</option>
                            <option v-for="center in centers" :value="center.id">{{center.name}}</option>
                        </select>
                    </div>

                    <div class="modal-footer">
                        <button type="button" v-on:click="save" class="btn btn-primary" data-dismiss="modal">Save</button>
                    </div>
                </div>
            </div>
        </div>
        <button id="auto-open" type="button" style="display: none" data-toggle="modal" data-target="#myModal5">
            Large Modal
        </button>
        </div>`,
  data() {
    return {
        img: "img/sofive/sofive.png",
        open: false,
        centers: [],
        facility_loading: false,
        selected: {
            center: "0",
        }
    }
  },
  mounted: function() {
    this.getCenters()
    const c = this.getCookie("center")
    if (!c) {
        document.querySelector("#auto-open").click()
    }
    this.getCenterImage()
    document.getElementById('top-search').onkeypress = function(e) {
        var event = e || window.event;
        var charCode = event.which || event.keyCode;

        if ( charCode == '13' ) {
          window.location = "search.html?query="+e.target.value
          return false;
        }
    }
  },
  methods: {
    getCenterImage: function() {
        const c = this.getCookie("center"),
        self = this;
        console.log("Get center image", c)
        if (!c) {
            return setTimeout(self.getCenterImage, 5000) // wait for cookie to be set
        }
        let img = "img/sofive/sofive.png"
        switch (c) {
            case "1":
                img = "img/sofive/sofivemdl.png"
                break;
            case "2":
                img = "img/sofive/sofiveekp.png"
                break;
            case "3":
                img = "img/sofive/sofivebrk.png"
                break;
            case "4":
                img = "img/sofive/sofiverok.png"
                break;
            case "5":
                img = "img/sofive/sofiverok.png"
                break;
            default:
        }
        this.img = img
    },
    getCenters: function() {
        this.facility_loading = true
        this.centers = []
        this.$http.get("http://localhost:8080/facility/")
            .then((resp) => {
                this.centers = resp.body;
                this.facility_loading = false
            })
            .catch((err) => {
                console.log(err.body.errors)
            })
    },
    save: function() {
        if (this.selected.center !== "0") {
            this.setCookie(this.selected.center)
        }
    },
    setCookie: function(value) {
        var date = new Date();
        date.setTime(date.getTime() + (9999*24*60*60*1000));
        let expires = "; expires=" + date.toUTCString();
        document.cookie = "center=" + (value || "")  + expires + "; path=/";
        this.getCenterImage()
    },
    getCookie: function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
  }
});
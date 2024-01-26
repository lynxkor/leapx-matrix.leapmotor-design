<template>
  <div id="app">
    <LyHeader />
    <div class="main-wrapper">
      <div class="main-row">
        <div class="main-menu">
          <div
            class="main-menu-inner"
            :class="[menuFixed ? 'lp-affix' : '']"
            :style="{
              width: menuWidth + 'px'
            }"
          >
            <ul class="main-menu-ul">
              <li
                v-for="item in menuList"
                :key="item.name"
                class="main-menu-li"
                :class="[selectedKey === item.name ? 'main-menu-li-selected' : '']"
              >
                <span class="main-menu-li-content">
                  <router-link :to="item.path">
                    {{ item.name }}
                  </router-link>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div class="main-content">
          <section class="main-container">
            <Demo :demo-info="demoInfo">
              <router-view class="view" />
            </Demo>
            <!-- <router-view class="view" /> -->
          </section>
        </div>
      </div>
    </div>
    <!-- <div id="nav">
      <router-link
        v-for="item in menuList"
        :key="item.name"
        :to="item.path"
      >
        {{ item.name }}
      </router-link>
    </div> -->
  </div>
</template>
<script>
import LyHeader from './layouts/header/index.vue'
import Demo from './layouts/Demo.vue'
export default {
  components: {
    LyHeader,
    Demo
  },
  data () {
    return {
      menuList: [
        // route-link start 请勿删除本注释
        {
          name: 'ossUploader',
          path: '/uploader/ossUploader'
        },
        // route-link end
      ],
      selectedKey: '',
      demoInfo: {},
      menuFixed: false,
      menuWidth: ''
    }
  },
  watch: {
    $route: {
      handler: function (val) {
        console.log(val)
        this.selectedKey = val.name
        this.demoInfo = {
          name: val.name
        }
      }
    }
  },
  created () {
    this.getSelectedKey()
  },
  mounted () {
    this.addScrollEvent()
    setTimeout(() => {
      this.menuWidth = document.querySelector('.main-wrapper').clientWidth * 0.2
    }, 100)
  },
  methods: {
    getSelectedKey () {
      this.selectedKey = this.$route.name
      this.demoInfo = {
        name: this.$route.name
      }
    },
    addScrollEvent () {
      window.addEventListener('scroll', this.scrollHandel)
    },
    scrollHandel () {
      if (document.documentElement.scrollTop > 64) {
        this.menuFixed = true
      } else {
        this.menuFixed = false
      }
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollHandel)
  }
}
</script>

<style lang="less">
* {
  padding: 0;
  margin: 0;
}
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  // display: flex;
}

#nav {
  padding: 0 10px;
  width: 100px;
  height: 100vh;
  box-shadow: 1px 0px 1px #333;
  display: flex;
  flex-direction: column;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.view {
  flex: 1;
}
</style>

<style lang="less">
:root {
  --red: #f10000;
  --warn: #fa0;
  --primary: #3360ff;
  --bg-reg: #f0f3f4;
  --bg-canvas: #eceff4;
  --border-primary: #e7e8e9;
}
.main-wrapper {
  position: relative;
  padding: 40px 0 0;
  background: #fff;
  transition: all .3s cubic-bezier(.78,.14,.15,.86);
}
.main-row {
  display: flex;
  flex-flow: row wrap;
  row-gap: 0px;
}
.main-menu {
  display: block;
  flex: 0 0 20%;
  max-width: 20%;
  &:hover {
    .main-menu-inner {
      overflow-y: auto;
    }
  }
  &-inner {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    overflow: hidden;
  }
  &-ul {
    box-sizing: border-box;
    margin: 0;
    font-variant: tabular-nums;
    line-height: 1.5715;
    font-feature-settings: "tnum";
    padding: 0;
    color: #000000d9;
    font-size: 14px;
    line-height: 0;
    text-align: left;
    list-style: none;
    background: #fff;
    outline: none;
    border-right: 1px solid #f0f0f0;
    transition: all .3s cubic-bezier(.78,.14,.15,.86);
    padding-bottom: 48px;
  }
  &-li {
    display: flex;
    align-items: center;
    transition: border-color .3s,background .3s,padding .1s cubic-bezier(.215,.61,.355,1);
    padding-left: 40px!important;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    position: relative;
    &:active {
      background-color: #e6f7ff;
    }
    &-content {
      flex: auto;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: color .3s;
      a {
        color: #000000d9;
        &:hover {
          color: var(--primary);
        }
        &::before {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background-color: transparent;
          content: "";
        }
      }
    }
    &:hover {
      color: var(--primary);
    }
    &::after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      border-right: 3px solid var(--primary);
      transform: scaleY(.0001);
      opacity: 0;
      transition: transform .15s cubic-bezier(.215,.61,.355,1),opacity .15s cubic-bezier(.215,.61,.355,1);
      content: "";
    }
    &-selected {
      background-color: #e6f7ff;
      a {
        color: var(--primary);
      }
      &::after {
        transform: scaleY(1);
        opacity: 1;
        transition: transform .15s cubic-bezier(.645,.045,.355,1),opacity .15s cubic-bezier(.645,.045,.355,1);
      }
    }
  }
}
.lp-affix {
  position: fixed;
  top: 0px;
}
.main-content  {
  display: block;
  flex: 0 0 80%;
  max-width: 80%;
}
.main-container {
  position: relative;
  min-height: 500px;
  padding: 0 170px 32px 64px;
  background: #fff;
}
</style>

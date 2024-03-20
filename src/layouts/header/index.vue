<template>
  <header id="header" class="clearfix">
    <div class="header-main">
      <div class="header-logo">
        <span class="text">Leapmotor Design</span>
      </div>
      <div class="header-menu">
        <div class="header-search"></div>
        <div class="header-action">
          <button @click="goCnpm" class="lp-btn lp-btn-sm">CNPM</button>
          <button @click="goGitlab" class="lp-btn lp-btn-sm">GitLab</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    goCnpm () {
      // TODO
      // window.open('')
    },
    goGitlab () {
      window.open('https://git-external.leapmotor.com/business-front/webx/leapmotor-design')
    }
  }
}
</script>

<style lang="less">
#header {
  position: relative;
  z-index: 10;
  max-width: 100%;
  background: #fff;
  box-shadow: 0 2px 8px #f0f1f2;
  height: 64px;
}

.header {
  &-main {
    height: 100%;
    display: flex;
    flex-grow: nowrap;
    row-gap: 0px;
  }
  &-logo {
    display: block;
    flex: 0 0 20%;
    max-width: 20%;
    line-height: 64px;
    .text {
      margin-left: 30px;
      color: #000000d9;
      font-weight: 700;
      font-size: 18px;
      font-family: PuHuiTi,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,apple color emoji,segoe ui emoji,Segoe UI Symbol,noto color emoji,sans-serif;
    }
  }
  &-menu {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 0 0 80%;
    max-width: 80%;
  }
  &-action {
    margin-right: 40px;

    .lp-btn {
      margin-right: 10px;
      &:last-child {
        margin-right: 0px;
      }
    }
  }
}

.clearfix:after {
  display: table;
  clear: both;
  content: "";
}

.lp-btn {
  line-height: 1.5715;
  position: relative;
  display: inline-block;
  font-weight: 400;
  white-space: nowrap;
  text-align: center;
  background-image: none;
  border: 1px solid transparent;
  box-shadow: 0 2px #00000004;
  cursor: pointer;
  transition: all .3s cubic-bezier(.645,.045,.355,1);
  user-select: none;
  touch-action: manipulation;
  height: 32px;
  padding: 4px 15px;
  font-size: 14px;
  border-radius: 2px;
  color: #000000d9;
  border-color: #d9d9d9;
  background: #fff;

  &-sm {
    height: 24px;
    padding: 0 7px;
    font-size: 14px;
    border-radius: 2px;
  }

  &:focus {
    outline: 0;
  }
}
</style>

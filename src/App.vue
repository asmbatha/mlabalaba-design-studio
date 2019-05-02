<template>
  <v-app dark>
    <v-navigation-drawer
      mini-variant
      clipped
      permanent
      fixed
      app
    >
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          :key="i"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      clipped-left
      fixed
      app
    >
      <v-toolbar-title v-text="title" />
    </v-toolbar>
    <v-content>
      <v-container
        fluid
        fill-height
        pa-0
      >
        <router-view/>
      </v-container>
    </v-content>
    <v-footer
      fixed
      app
    >
      <span>&copy; w3ppmedia</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          icon: 'apps',
          title: 'Welcome'
        },
        {
          icon: 'bubble_chart',
          title: 'Inspire'
        }
      ],
      title: 'AI Visualizer'
    }
  }
}
</script>

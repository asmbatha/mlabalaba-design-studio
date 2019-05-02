<template>
  <v-card>
    <v-card-text>
      <v-textarea
        label="JSON State"
        ref="jsonState"
        :value="JSON.stringify(matchState, null, 8)"
      ></v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn>
        save
      </v-btn>
      <v-btn>
        reset
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    props: ['matchState']
  }
</script>

<style>

</style>

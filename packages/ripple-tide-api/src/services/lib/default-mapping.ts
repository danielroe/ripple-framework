export default {
  mapping: {
    title: 'title',
    changed: 'changed',
    created: 'created',
    type: (data: any) => data.type && data.type.replace('node--', ''),
    nid: 'drupal_internal__nid'
  },
  includes: []
}

export default ({ now }) =>
  ({ error }) =>
  (value, _, passError) =>
    value < now() || passError(error);

/*
 params is the straight up params
 {
     params: { ...straight up params },
     refs: { g: {
         value:'',
         label:''
     }}
 }
//
//
//
*/

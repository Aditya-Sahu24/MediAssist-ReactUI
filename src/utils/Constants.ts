// Constants.ts
export function getISTDate() {
   const someDate = new Date();
   const istOffset = 5.5 * 60 * 60 * 1000;
 
   const istDate = new Date(someDate.getTime() + istOffset);
 
   const defaultValues = istDate.toISOString().split("T")[0];
   const defaultValuestime = istDate.toISOString();
 
   return {
       defaultValues,
       defaultValuestime,
   };
 }
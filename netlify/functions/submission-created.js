exports.handler = async (event) => {
  console.log("Form submitted:", event.body);

  return {
    statusCode: 200,
    body: "ok"
  };
};

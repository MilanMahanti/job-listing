const loader = async ({ params }) => {
  console.log(params);
  const url = import.meta.env.VITE_SERVER_URL + "/api/v1/job/" + params.id;
  const res = await fetch(url);

  if (res.status === 404) {
    throw new Response("Not found", { status: 404 });
  }

  return res.json();
};

export default loader;

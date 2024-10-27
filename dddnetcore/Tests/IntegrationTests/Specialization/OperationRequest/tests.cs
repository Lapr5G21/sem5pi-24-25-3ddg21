// POST https://localhost:5001/api/specializations

// Body:
/*
{
    "specializationName" : "{{$guid}}"
}
*/


// Test:

/*
pm.test("Specialization created sucessfully", function () {
    pm.response.to.have.status(201);
    const responseData = pm.response.json();
    pm.expect(responseData).has.property("specializationName");
    pm.expect(responseData.specializationName).to.not.be.null;
});
*/


// GET https://localhost:5001/api/specializations

// Test:

/*
pm.test("Specializations Found", function () {
    pm.response.to.have.status(200);
});
*/
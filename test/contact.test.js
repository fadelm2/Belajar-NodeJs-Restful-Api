import supertest from "supertest";
import {web} from "../src/application/web.js";
import {logger} from "../src/application/logging.js";
import {
    createTestUser,
    removeTestUser,
    removeAllTestContacts,
    createTestContact, getTestContact
} from "./test-util.js";


describe("POST /api/contacts" ,function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    });

    it("should can create contact", async () => {
        const result = await supertest(web)
            .post('/api/contacts')
            .set('Authorization', 'test')
            .send({
                first_name: "test",
                last_name: "test",
                email: "test@pzn.com",
                phone: "08090000000"
            });


        logger.info(result);
        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.first_name).toBe("test");
        expect(result.body.data.last_name).toBe("test");
        expect(result.body.data.email).toBe("test@pzn.com");
        expect(result.body.data.phone).toBe("08090000000");


    });

    it('should reject if request is not valid', async () => {
        const result = await supertest(web)
            .post("/api/contacts")
            .set('Authorization', 'test')
            .send({
                first_name: "",
                last_name: "test",
                email: "test",
                phone: "0809000000043534534543534534543535345435435"
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
})


describe("GET /api/contacts/:contactId" ,function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can get contact', async ()=>{
      const testContact = await getTestContact();

      const result = await supertest(web)
          .get('/api/contacts/' + testContact.id)
          .set('Authorization', 'test')

        logger.info(result)
        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testContact.id)
        expect(result.body.data.first_name).toBe(testContact.first_name)
        expect(result.body.data.last_name).toBe(testContact.last_name)
        expect(result.body.data.email).toBe(testContact.email)
        expect(result.body.data.phone).toBe(testContact.phone);
    })

    it('should return 404 if contact id is not found', async ()=>{
        const testContact = await getTestContact();

        const result = await supertest(web)
            .get('/api/contacts/' + 1231)
            .set('Authorization', 'test')

        logger.info(result)
        expect(result.status).toBe(404);

    })


})
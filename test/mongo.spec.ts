import 'mocha';
import { expect } from 'chai';
import { MongoClientConnection, CreateNewTask } from '../src/utils'

describe('Running TypeScript tests in ts-node runtime without compilation', () => {

  let mongoClient: MongoClientConnection;
  before(async () => {
    // init mongo and inserts mock data
    mongoClient = new MongoClientConnection();
    return await mongoClient.connect();
  });


  beforeEach("Insert Items into the list", async () => {
    // insert task and verify if it works
    // const new_task = CreateNewTask("Test", new Date().toString(), new Date().getTime().toString());

    // expect(new_task.status).to.equal('NEW');

    // return mongoClient.addTask(new_task);

  })

  it('Create a new Task and expect State To be New', async () => {

    // insert task and verify if it works
    // const new_task = CreateNewTask("Test", new Date().toString(), new Date().getTime().toString());

    // expect(new_task.status).to.equal('NEW');

    // return mongoClient.addTask(new_task);

    // expect(hello()).to.equal("Hello`` World!");

  });

});
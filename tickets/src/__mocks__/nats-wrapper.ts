export const natsWrapper = {
    client: {
        //to create fake function
        publish: jest.fn().mockImplementation((subject: string, data: any, callback: () => void) => {
            callback();
        })
    }
}
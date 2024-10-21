import { getBankAccount } from '.';
import lodash from 'lodash';

describe('BankAccount', () => {
  const account = getBankAccount(1000);
  const account2 = getBankAccount(500);

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(1000);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(10000)).toThrow('Insufficient funds: cannot withdraw more than 1000');
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => account.transfer(10000, account2)).toThrow('Insufficient funds: cannot withdraw more than 1000');
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(500, account)).toThrow('Transfer failed');
  });

  test('should deposit money', () => {
    account.deposit(500);
    expect(account.getBalance()).toBe(1500);
  });

  test('should withdraw money', () => {
    account.withdraw(50);
    expect(account.getBalance()).toBe(1450);
  });

  test('should transfer money', () => {
    account.transfer(600, account2);
    expect(account.getBalance()).toBe(850);
    expect(account2.getBalance()).toBe(1100);
  });

  /**jest.spyOn(object, methodName)
   Creates a mock function similar to jest.fn but also tracks calls to object[methodName]. 
   Returns a Jest mock function. By default, jest.spyOn also calls the spied method. 
   This is different behavior from most other test libraries. 
   If you want to overwrite the original function, you can use 
   jest.spyOn(object, methodName).mockImplementation(() => customImplementation) or 
   object[methodName] = jest.fn(() => customImplementation). 
  */

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest.spyOn(lodash, 'random').mockImplementationOnce(() => 50);
    jest.spyOn(lodash, 'random').mockImplementationOnce(() => 1);
    const balance = await account.fetchBalance();
    expect(balance).toBe(50);
    expect(typeof balance).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(lodash, 'random').mockImplementationOnce(() => 50);
    jest.spyOn(lodash, 'random').mockImplementationOnce(() => 1);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(50);
  });

  /**
   * .resolves / .rejects
   * You can also use the .resolves matcher in your expect statement, and Jest will wait for that promise to resolve.
   * If the promise is rejected, the test will automatically fail.
   * test('the data is peanut butter', () => {
   * return expect(fetchData()).resolves.toBe('peanut butter');
   * If you expect a promise to be rejected, use the .rejects matcher.
   * It works analogically to the .resolves matcher. If the promise is fulfilled, the test will automatically fail.
   * Normally, when dealing with promises, you'd use await to ensure that your test waits for the promise to resolve
   * or reject before proceeding. However, with .resolves and .rejects, Jest automatically understands that you're working with a promise and waits for the result.
   * The promise is returned directly from expect, so Jest handles it behind the scenes.
   * However, you can also use async/await with .resolves or .rejects if you prefer that style.
   * Both work the same way, but using await can make the syntax more consistent if you're using async/await elsewhere in your tests});
   */

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(lodash, 'random').mockImplementationOnce(() => 50);
    jest.spyOn(lodash, 'random').mockImplementationOnce(() => 0);
    await expect(account.synchronizeBalance()).rejects.toThrow('Synchronization failed');
  });
});

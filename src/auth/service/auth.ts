import { Auth, CognitoUser } from '@aws-amplify/auth';

export async function signIn(
  email: string,
  password: string
): Promise<CognitoUser> {
  try {
    const user = await Auth.signIn(email, password);
    return await Promise.resolve(user as CognitoUser);
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function signUp(
  email: string,
  password: string
): Promise<CognitoUser> {
  try {
    const { user } = await Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
      },
    });
    return await Promise.resolve(user as CognitoUser);
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function confirmSignUp(
  email: string,
  code: string
): Promise<CognitoUser> {
  try {
    const user = await Auth.confirmSignUp(email, code);
    return await Promise.resolve(user as CognitoUser);
  } catch (error) {
    return Promise.reject(error);
  }
}

import { createParamDecorator } from 'routing-controllers';
import { currentOrganizationChecker } from '~/resources/User/AuthService';

export default function () {
    return createParamDecorator({
        value: currentOrganizationChecker,
    });
}
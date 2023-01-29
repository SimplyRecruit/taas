import { currentOrganizationChecker } from '~/resources/User/AuthService';
import { createParamDecorator } from 'routing-controllers';

export default function () {
    return createParamDecorator({
        value: currentOrganizationChecker,
    });
}
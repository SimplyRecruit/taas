import { createParamDecorator, UnauthorizedError } from 'routing-controllers';
import { OrganizationEntity } from '../resources/Organization/Entity';
import { checkCurrentUser } from '../resources/User/AuthService';
import { UserEntity } from '../resources/User/Entity';

export default function () {
    return createParamDecorator({
        value: async action => {
            const currentUser = await checkCurrentUser(action)
            if (currentUser == null) throw new UnauthorizedError()
            return await OrganizationEntity.findOneBy({ users: { id: currentUser.id } })
        },
    });
}
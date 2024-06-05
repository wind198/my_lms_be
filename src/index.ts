import { Strapi } from "@strapi/strapi";
import { faker } from "@faker-js/faker";
import { fill, shuffle } from "lodash";
import { buildUsername } from "./common/helpers";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Strapi }) {
    /** Map users */
    const userN = 100;

    const majorN = 5;

    const roomN = 10;

    const allEducationalBackgrounds = [
      "highschool",
      "under_graduate",
      "graduate",
    ] as const;

    const allUserTypes = ["admin", "teacher", "student", "staff"] as const;

    const allRoles = await strapi.entityService.findMany(
      "plugin::users-permissions.role",
      {}
    );

    const allMajorTitles = ["Art", "Sciences", "Economics"];

    const currentUserCount = await strapi.entityService.count(
      "plugin::users-permissions.user"
    );

    if (!currentUserCount) {
      await Promise.allSettled([
        Array(userN)
          .fill(0)
          .map((_) => {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const username = buildUsername(firstName, lastName);

            return strapi.entityService.create(
              "plugin::users-permissions.user",
              {
                data: {
                  firstName,
                  lastName,
                  educationBackground: shuffle(allEducationalBackgrounds)[0],
                  email: faker.internet.email(),
                  username,
                  type: shuffle(allUserTypes)[0],
                  role: shuffle((allRoles as any[]).map((i) => i.id))[0],
                },
              }
            );
          }),
      ]);
    }

    const currentMajorCount = await strapi.entityService.count(
      "api::major.major"
    );

    if (!currentMajorCount) {
      await Promise.all(
        Array(majorN)
          .fill(0)
          .map((_) => {
            return strapi.entityService.create("api::major.major", {
              data: {
                title: shuffle(allMajorTitles)[0],
              },
            });
          })
      );
    }

    const currentRoomCount = await strapi.entityService.count("api::room.room");

    if (!currentRoomCount) {
      await Promise.all(
        Array(roomN)
          .fill(0)
          .map((_) => {
            return strapi.entityService.create("api::room.room", {
              data: {
                isActive: true,
                address: faker.location.streetAddress(),
                title: faker.location.city(),
              },
            });
          })
      );
    }
  },
};

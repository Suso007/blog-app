import { faker } from '@faker-js/faker';
import { prisma } from '../lib/prisma'


async function main() {
    console.log('Clearing existing posts...');
    await prisma.post.deleteMany();

    console.log('Generating fake post data...');

    // Generate an array of 50 fake posts
    const postsData = Array.from({ length: 50 }).map(() => {
        const title = faker.lorem.sentence({ min: 4, max: 8 });

        return {
            title: title,
            // Create a URL-friendly slug and append a random string to guarantee uniqueness
            slug: `${faker.helpers.slugify(title).toLowerCase()}-${faker.string.alphanumeric(6)}`,
            excerpt: faker.lorem.paragraph(2),
            content: faker.lorem.paragraphs({ min: 4, max: 10 }, '\n\n'),
            category: faker.helpers.arrayElement(['Web Development', 'React', 'PostgreSQL', 'Linux', 'Tech News']),
            coverImage: faker.image.urlLoremFlickr({ category: 'technology', width: 800, height: 600 }),
            published: faker.datatype.boolean({ probability: 0.8 }), // 80% chance to be true
            createdAt: faker.date.past({ years: 1 }),
            // updatedAt is automatically handled by Prisma's @updatedAt attribute
        };
    });

    console.log('Inserting posts into the database...');

    // Bulk insert using createMany
    const result = await prisma.post.createMany({
        data: postsData,
        skipDuplicates: true,
    });

    console.log(`✅ Successfully seeded ${result.count} posts.`);
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
# TODO: 

- Import controllers by directory path (Waiting for the new update of routing-controllers)
- Setup soft delete
- If we have more common folders other than 'models', think about a common absolute path alias. "package" or "project" seems good for now
- Integrate useQuery to useApi hook
- Generate schemas for all locales by default



# Creating a new translation namespace
- `npm run create-locale-namespace`
- Enter name
- Always start with English translations
- After finished with English translations run: 
- `npm run generate-locale-schemas`
- Enter name
- This will update the schema based on the English translations
- If a translation is missing for other languages, IDE will give a warning
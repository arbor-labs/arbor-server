import { MigrationInterface, QueryRunner } from "typeorm";

export class ProjectRevisions1741723251193 implements MigrationInterface {
    name = 'ProjectRevisions1741723251193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop the old unique constraint
        await queryRunner.query(`ALTER TABLE "stems" DROP CONSTRAINT "UniqueStemName"`);

        // Add the new unique constraint
        await queryRunner.query(`ALTER TABLE "stems" ADD CONSTRAINT "UniqueStem" UNIQUE ("name", "filename", "filesize", "audioCID")`);

        // Add the new index on audioCID
        await queryRunner.query(`CREATE INDEX "IDX_cba3f0e830857f0c9da142ee3d" ON "stems" ("audioCID")`);

        // Create project_revisions table
        await queryRunner.query(`CREATE TABLE "project_revisions" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "stem_cids" text NOT NULL, "audioCID" character varying NOT NULL, "metadataCID" character varying NOT NULL, "projectId" character varying, CONSTRAINT "UQ_70af263890bea2a019470196048" UNIQUE ("id"), CONSTRAINT "UQ_52e67e5d16370232dbfb22abe48" UNIQUE ("projectId", "version"), CONSTRAINT "PK_70af263890bea2a019470196048" PRIMARY KEY ("id"))`);

        await queryRunner.query(`CREATE INDEX "IDX_f1f0b8bcb607e2585e88a4f897" ON "project_revisions" ("audioCID")`);

        // Add foreign key for project_revisions
        await queryRunner.query(`ALTER TABLE "project_revisions" ADD CONSTRAINT "FK_5ca511b95cc835765bf3ed44cc5" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the project_revisions related items first
        await queryRunner.query(`ALTER TABLE "project_revisions" DROP CONSTRAINT "FK_5ca511b95cc835765bf3ed44cc5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f1f0b8bcb607e2585e88a4f897"`);
        await queryRunner.query(`DROP TABLE "project_revisions"`);

        // Revert the stems table changes
        await queryRunner.query(`DROP INDEX "public"."IDX_cba3f0e830857f0c9da142ee3d"`);
        await queryRunner.query(`ALTER TABLE "stems" DROP CONSTRAINT "UniqueStem"`);
        await queryRunner.query(`ALTER TABLE "stems" ADD CONSTRAINT "UniqueStemName" UNIQUE ("name", "filename")`);
    }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProjectRevisions1741658346291 implements MigrationInterface {
    name = 'AddProjectRevisions1741658346291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_a919da6e685fb375c9342186b0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2187088ab5ef2a918473cb9900"`);
        await queryRunner.query(`ALTER TABLE "stems" DROP CONSTRAINT "UniqueStemName"`);
        await queryRunner.query(`CREATE TABLE "project_revisions" ("id" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "stem_cids" text NOT NULL, "audioCID" character varying NOT NULL, "metadataCID" character varying NOT NULL, "projectId" character varying, CONSTRAINT "UQ_70af263890bea2a019470196048" UNIQUE ("id"), CONSTRAINT "UQ_52e67e5d16370232dbfb22abe48" UNIQUE ("projectId", "version"), CONSTRAINT "PK_70af263890bea2a019470196048" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f1f0b8bcb607e2585e88a4f897" ON "project_revisions" ("audioCID") `);
        await queryRunner.query(`ALTER TABLE "queued_stems" DROP CONSTRAINT "FK_b4d2ab7fb4b2eda6a2cc633aee9"`);
        await queryRunner.query(`ALTER TABLE "project_stems" DROP CONSTRAINT "FK_98d3a69d3a8a24fbb291dab438d"`);
        await queryRunner.query(`ALTER TABLE "stems" ADD CONSTRAINT "UQ_d59cf5f05fd28912e18d59abae4" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "queued_stems" ADD CONSTRAINT "UQ_3102ebccd0c072d88b4fc84854f" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "queued_stems" DROP CONSTRAINT "FK_4779a832b71abfe00193192bcf3"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_fb96d293d6e4a0a133be0d47687"`);
        await queryRunner.query(`ALTER TABLE "project_queues" ADD CONSTRAINT "UQ_4a004880aa2c3be7de785944809" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "project_collaborators" DROP CONSTRAINT "FK_138b261432f117d9241d3027f14"`);
        await queryRunner.query(`ALTER TABLE "project_stems" DROP CONSTRAINT "FK_8b3ff2193a08e5da889e6173859"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "UQ_6271df0a7aed1d6c0691ce6ac50" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "stems" DROP CONSTRAINT "FK_b5ea88657d527455ed0bc5db8a7"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_f55144dc92df43cd1dad5d29b90"`);
        await queryRunner.query(`ALTER TABLE "semaphore_identities" DROP CONSTRAINT "FK_9167de7cd9c02dd04829cbd331c"`);
        await queryRunner.query(`ALTER TABLE "project_collaborators" DROP CONSTRAINT "FK_d0f8f3810f107c59bc0074b316c"`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "UQ_5a7a02c20412299d198e097a8fe" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "semaphore_identities" ADD CONSTRAINT "UQ_fe81773771059c43e10a8131961" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_f482e212b8f622e47ea9fd0f4c3"`);
        await queryRunner.query(`ALTER TABLE "semaphore_identities" DROP CONSTRAINT "FK_1ec42bfa6ecaf26349f233b2d5d"`);
        await queryRunner.query(`ALTER TABLE "voting_groups" ADD CONSTRAINT "UQ_6482b64563d799d7a1618c7c55c" UNIQUE ("id")`);
        await queryRunner.query(`CREATE INDEX "IDX_a919da6e685fb375c9342186b0" ON "stems" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_cba3f0e830857f0c9da142ee3d" ON "stems" ("audioCID") `);
        await queryRunner.query(`CREATE INDEX "IDX_2187088ab5ef2a918473cb9900" ON "projects" ("name") `);
        await queryRunner.query(`ALTER TABLE "stems" ADD CONSTRAINT "UniqueStem" UNIQUE ("name", "filename", "filesize", "audioCID")`);
        await queryRunner.query(`ALTER TABLE "stems" ADD CONSTRAINT "FK_b5ea88657d527455ed0bc5db8a7" FOREIGN KEY ("createdById") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "queued_stems" ADD CONSTRAINT "FK_4779a832b71abfe00193192bcf3" FOREIGN KEY ("queueId") REFERENCES "project_queues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "queued_stems" ADD CONSTRAINT "FK_b4d2ab7fb4b2eda6a2cc633aee9" FOREIGN KEY ("stemId") REFERENCES "stems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_revisions" ADD CONSTRAINT "FK_5ca511b95cc835765bf3ed44cc5" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_f55144dc92df43cd1dad5d29b90" FOREIGN KEY ("createdById") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_fb96d293d6e4a0a133be0d47687" FOREIGN KEY ("queueId") REFERENCES "project_queues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_f482e212b8f622e47ea9fd0f4c3" FOREIGN KEY ("votingGroupId") REFERENCES "voting_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "semaphore_identities" ADD CONSTRAINT "FK_9167de7cd9c02dd04829cbd331c" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "semaphore_identities" ADD CONSTRAINT "FK_1ec42bfa6ecaf26349f233b2d5d" FOREIGN KEY ("groupId") REFERENCES "voting_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_collaborators" ADD CONSTRAINT "FK_138b261432f117d9241d3027f14" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_collaborators" ADD CONSTRAINT "FK_d0f8f3810f107c59bc0074b316c" FOREIGN KEY ("accountsId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_stems" ADD CONSTRAINT "FK_8b3ff2193a08e5da889e6173859" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_stems" ADD CONSTRAINT "FK_98d3a69d3a8a24fbb291dab438d" FOREIGN KEY ("stemsId") REFERENCES "stems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_stems" DROP CONSTRAINT "FK_98d3a69d3a8a24fbb291dab438d"`);
        await queryRunner.query(`ALTER TABLE "project_stems" DROP CONSTRAINT "FK_8b3ff2193a08e5da889e6173859"`);
        await queryRunner.query(`ALTER TABLE "project_collaborators" DROP CONSTRAINT "FK_d0f8f3810f107c59bc0074b316c"`);
        await queryRunner.query(`ALTER TABLE "project_collaborators" DROP CONSTRAINT "FK_138b261432f117d9241d3027f14"`);
        await queryRunner.query(`ALTER TABLE "semaphore_identities" DROP CONSTRAINT "FK_1ec42bfa6ecaf26349f233b2d5d"`);
        await queryRunner.query(`ALTER TABLE "semaphore_identities" DROP CONSTRAINT "FK_9167de7cd9c02dd04829cbd331c"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_f482e212b8f622e47ea9fd0f4c3"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_fb96d293d6e4a0a133be0d47687"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_f55144dc92df43cd1dad5d29b90"`);
        await queryRunner.query(`ALTER TABLE "project_revisions" DROP CONSTRAINT "FK_5ca511b95cc835765bf3ed44cc5"`);
        await queryRunner.query(`ALTER TABLE "queued_stems" DROP CONSTRAINT "FK_b4d2ab7fb4b2eda6a2cc633aee9"`);
        await queryRunner.query(`ALTER TABLE "queued_stems" DROP CONSTRAINT "FK_4779a832b71abfe00193192bcf3"`);
        await queryRunner.query(`ALTER TABLE "stems" DROP CONSTRAINT "FK_b5ea88657d527455ed0bc5db8a7"`);
        await queryRunner.query(`ALTER TABLE "stems" DROP CONSTRAINT "UniqueStem"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2187088ab5ef2a918473cb9900"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cba3f0e830857f0c9da142ee3d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a919da6e685fb375c9342186b0"`);
        await queryRunner.query(`ALTER TABLE "voting_groups" DROP CONSTRAINT "UQ_6482b64563d799d7a1618c7c55c"`);
        await queryRunner.query(`ALTER TABLE "semaphore_identities" ADD CONSTRAINT "FK_1ec42bfa6ecaf26349f233b2d5d" FOREIGN KEY ("groupId") REFERENCES "voting_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_f482e212b8f622e47ea9fd0f4c3" FOREIGN KEY ("votingGroupId") REFERENCES "voting_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "semaphore_identities" DROP CONSTRAINT "UQ_fe81773771059c43e10a8131961"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "UQ_5a7a02c20412299d198e097a8fe"`);
        await queryRunner.query(`ALTER TABLE "project_collaborators" ADD CONSTRAINT "FK_d0f8f3810f107c59bc0074b316c" FOREIGN KEY ("accountsId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "semaphore_identities" ADD CONSTRAINT "FK_9167de7cd9c02dd04829cbd331c" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_f55144dc92df43cd1dad5d29b90" FOREIGN KEY ("createdById") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stems" ADD CONSTRAINT "FK_b5ea88657d527455ed0bc5db8a7" FOREIGN KEY ("createdById") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "UQ_6271df0a7aed1d6c0691ce6ac50"`);
        await queryRunner.query(`ALTER TABLE "project_stems" ADD CONSTRAINT "FK_8b3ff2193a08e5da889e6173859" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_collaborators" ADD CONSTRAINT "FK_138b261432f117d9241d3027f14" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_queues" DROP CONSTRAINT "UQ_4a004880aa2c3be7de785944809"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_fb96d293d6e4a0a133be0d47687" FOREIGN KEY ("queueId") REFERENCES "project_queues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "queued_stems" ADD CONSTRAINT "FK_4779a832b71abfe00193192bcf3" FOREIGN KEY ("queueId") REFERENCES "project_queues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "queued_stems" DROP CONSTRAINT "UQ_3102ebccd0c072d88b4fc84854f"`);
        await queryRunner.query(`ALTER TABLE "stems" DROP CONSTRAINT "UQ_d59cf5f05fd28912e18d59abae4"`);
        await queryRunner.query(`ALTER TABLE "project_stems" ADD CONSTRAINT "FK_98d3a69d3a8a24fbb291dab438d" FOREIGN KEY ("stemsId") REFERENCES "stems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "queued_stems" ADD CONSTRAINT "FK_b4d2ab7fb4b2eda6a2cc633aee9" FOREIGN KEY ("stemId") REFERENCES "stems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f1f0b8bcb607e2585e88a4f897"`);
        await queryRunner.query(`DROP TABLE "project_revisions"`);
        await queryRunner.query(`ALTER TABLE "stems" ADD CONSTRAINT "UniqueStemName" UNIQUE ("name", "filename")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2187088ab5ef2a918473cb9900" ON "projects" ("name") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a919da6e685fb375c9342186b0" ON "stems" ("name") `);
    }

}

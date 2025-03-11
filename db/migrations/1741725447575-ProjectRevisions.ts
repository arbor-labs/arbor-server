import { MigrationInterface, QueryRunner } from "typeorm";

export class ProjectRevisions1741725447575 implements MigrationInterface {
    name = 'ProjectRevisions1741725447575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_a919da6e685fb375c9342186b0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2187088ab5ef2a918473cb9900"`);
        await queryRunner.query(`ALTER TABLE "stems" DROP CONSTRAINT "UniqueStemName"`);
        await queryRunner.query(`CREATE TABLE "project_revisions" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "stem_cids" text NOT NULL, "audio_cid" character varying NOT NULL, "metadata_cid" character varying NOT NULL, "projectId" character varying, CONSTRAINT "UQ_70af263890bea2a019470196048" UNIQUE ("id"), CONSTRAINT "UQ_52e67e5d16370232dbfb22abe48" UNIQUE ("projectId", "version"), CONSTRAINT "PK_70af263890bea2a019470196048" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_09d1ab20bb93b06d29f578d0bd" ON "project_revisions" ("audio_cid") `);
        await queryRunner.query(`ALTER TABLE "stems" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "stems" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "stems" DROP COLUMN "metadataCID"`);
        await queryRunner.query(`ALTER TABLE "stems" DROP COLUMN "audioCID"`);
        await queryRunner.query(`ALTER TABLE "queued_stems" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "queued_stems" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "project_queues" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "project_queues" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "semaphore_identities" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "semaphore_identities" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "voting_groups" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "voting_groups" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "stems" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "stems" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "stems" ADD "metadata_cid" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stems" ADD "audio_cid" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "queued_stems" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "queued_stems" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "project_queues" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "project_queues" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "semaphore_identities" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "semaphore_identities" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "voting_groups" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "voting_groups" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
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
        await queryRunner.query(`CREATE INDEX "IDX_d8c388926efa358119843f7e52" ON "stems" ("audio_cid") `);
        await queryRunner.query(`CREATE INDEX "IDX_2187088ab5ef2a918473cb9900" ON "projects" ("name") `);
        await queryRunner.query(`ALTER TABLE "stems" ADD CONSTRAINT "UniqueStem" UNIQUE ("name", "filename", "filesize", "audio_cid")`);
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
        await queryRunner.query(`DROP INDEX "public"."IDX_d8c388926efa358119843f7e52"`);
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
        await queryRunner.query(`ALTER TABLE "voting_groups" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "voting_groups" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "semaphore_identities" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "semaphore_identities" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "project_queues" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "project_queues" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "queued_stems" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "queued_stems" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "stems" DROP COLUMN "audio_cid"`);
        await queryRunner.query(`ALTER TABLE "stems" DROP COLUMN "metadata_cid"`);
        await queryRunner.query(`ALTER TABLE "stems" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "stems" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "voting_groups" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "voting_groups" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "semaphore_identities" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "semaphore_identities" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "project_queues" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "project_queues" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "queued_stems" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "queued_stems" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "stems" ADD "audioCID" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stems" ADD "metadataCID" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stems" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "stems" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP INDEX "public"."IDX_09d1ab20bb93b06d29f578d0bd"`);
        await queryRunner.query(`DROP TABLE "project_revisions"`);
        await queryRunner.query(`ALTER TABLE "stems" ADD CONSTRAINT "UniqueStemName" UNIQUE ("name", "filename")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2187088ab5ef2a918473cb9900" ON "projects" ("name") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a919da6e685fb375c9342186b0" ON "stems" ("name") `);
    }

}

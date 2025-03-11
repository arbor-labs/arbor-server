import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1741726378134 implements MigrationInterface {
    name = 'InitialSchema1741726378134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stems" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(50) NOT NULL, "type" character varying NOT NULL, "metadata_cid" character varying NOT NULL, "audio_cid" character varying NOT NULL, "filename" character varying NOT NULL, "filetype" character varying NOT NULL, "filesize" integer NOT NULL, "created_by_id" character varying, CONSTRAINT "UQ_d59cf5f05fd28912e18d59abae4" UNIQUE ("id"), CONSTRAINT "UniqueStem" UNIQUE ("name", "filename", "filesize", "audio_cid"), CONSTRAINT "PK_d59cf5f05fd28912e18d59abae4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a919da6e685fb375c9342186b0" ON "stems" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_d8c388926efa358119843f7e52" ON "stems" ("audio_cid") `);
        await queryRunner.query(`CREATE TABLE "queued_stems" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "votes" integer NOT NULL, "queue_id" character varying, "stem_id" character varying, CONSTRAINT "UQ_3102ebccd0c072d88b4fc84854f" UNIQUE ("id"), CONSTRAINT "PK_3102ebccd0c072d88b4fc84854f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_queues" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4a004880aa2c3be7de785944809" UNIQUE ("id"), CONSTRAINT "PK_4a004880aa2c3be7de785944809" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_revisions" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "stem_cids" text NOT NULL, "audio_cid" character varying NOT NULL, "metadata_cid" character varying NOT NULL, "project_id" character varying, CONSTRAINT "UQ_70af263890bea2a019470196048" UNIQUE ("id"), CONSTRAINT "UQ_52e67e5d16370232dbfb22abe48" UNIQUE ("project_id", "version"), CONSTRAINT "PK_70af263890bea2a019470196048" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_09d1ab20bb93b06d29f578d0bd" ON "project_revisions" ("audio_cid") `);
        await queryRunner.query(`CREATE TABLE "projects" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(50) NOT NULL, "description" character varying(300) NOT NULL, "tags" text NOT NULL DEFAULT '[]', "bpm" integer NOT NULL, "track_limit" integer NOT NULL, "created_by_id" character varying, "queue_id" character varying, "voting_group_id" character varying, CONSTRAINT "UQ_6271df0a7aed1d6c0691ce6ac50" UNIQUE ("id"), CONSTRAINT "UniqueProjectName" UNIQUE ("name"), CONSTRAINT "REL_fb96d293d6e4a0a133be0d4768" UNIQUE ("queue_id"), CONSTRAINT "REL_f482e212b8f622e47ea9fd0f4c" UNIQUE ("voting_group_id"), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2187088ab5ef2a918473cb9900" ON "projects" ("name") `);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "address" character varying NOT NULL, "onboarding_signature" character varying NOT NULL, "display_name" character varying, "avatar_uri" character varying, CONSTRAINT "UQ_5a7a02c20412299d198e097a8fe" UNIQUE ("id"), CONSTRAINT "UniqueAccountAddress" UNIQUE ("address"), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_48ec5fcf335b99d4792dd5e453" ON "accounts" ("address") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_71247c75ff88bbd3ed112d9df1" ON "accounts" ("onboarding_signature") `);
        await queryRunner.query(`CREATE TABLE "semaphore_identities" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "account" text NOT NULL DEFAULT '[]', "group" text NOT NULL DEFAULT '[]', "commitment" character varying NOT NULL, "nullifier" character varying NOT NULL, "trapdoor" character varying NOT NULL, "account_id" character varying, "group_id" character varying, CONSTRAINT "UQ_fe81773771059c43e10a8131961" UNIQUE ("id"), CONSTRAINT "PK_fe81773771059c43e10a8131961" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "voting_groups" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6482b64563d799d7a1618c7c55c" UNIQUE ("id"), CONSTRAINT "PK_6482b64563d799d7a1618c7c55c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_collaborators" ("projects_id" character varying NOT NULL, "accounts_id" character varying NOT NULL, CONSTRAINT "PK_902f57db56ceb2296338324348e" PRIMARY KEY ("projects_id", "accounts_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_138b261432f117d9241d3027f1" ON "project_collaborators" ("projects_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d0f8f3810f107c59bc0074b316" ON "project_collaborators" ("accounts_id") `);
        await queryRunner.query(`CREATE TABLE "project_stems" ("projects_id" character varying NOT NULL, "stems_id" character varying NOT NULL, CONSTRAINT "PK_9ea1cb0846e127fee2535a916c0" PRIMARY KEY ("projects_id", "stems_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8b3ff2193a08e5da889e617385" ON "project_stems" ("projects_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_98d3a69d3a8a24fbb291dab438" ON "project_stems" ("stems_id") `);
        await queryRunner.query(`ALTER TABLE "stems" ADD CONSTRAINT "FK_b5ea88657d527455ed0bc5db8a7" FOREIGN KEY ("created_by_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "queued_stems" ADD CONSTRAINT "FK_4779a832b71abfe00193192bcf3" FOREIGN KEY ("queue_id") REFERENCES "project_queues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "queued_stems" ADD CONSTRAINT "FK_b4d2ab7fb4b2eda6a2cc633aee9" FOREIGN KEY ("stem_id") REFERENCES "stems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_revisions" ADD CONSTRAINT "FK_5ca511b95cc835765bf3ed44cc5" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_f55144dc92df43cd1dad5d29b90" FOREIGN KEY ("created_by_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_fb96d293d6e4a0a133be0d47687" FOREIGN KEY ("queue_id") REFERENCES "project_queues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_f482e212b8f622e47ea9fd0f4c3" FOREIGN KEY ("voting_group_id") REFERENCES "voting_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "semaphore_identities" ADD CONSTRAINT "FK_9167de7cd9c02dd04829cbd331c" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "semaphore_identities" ADD CONSTRAINT "FK_1ec42bfa6ecaf26349f233b2d5d" FOREIGN KEY ("group_id") REFERENCES "voting_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_collaborators" ADD CONSTRAINT "FK_138b261432f117d9241d3027f14" FOREIGN KEY ("projects_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_collaborators" ADD CONSTRAINT "FK_d0f8f3810f107c59bc0074b316c" FOREIGN KEY ("accounts_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_stems" ADD CONSTRAINT "FK_8b3ff2193a08e5da889e6173859" FOREIGN KEY ("projects_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_stems" ADD CONSTRAINT "FK_98d3a69d3a8a24fbb291dab438d" FOREIGN KEY ("stems_id") REFERENCES "stems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
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
        await queryRunner.query(`DROP INDEX "public"."IDX_98d3a69d3a8a24fbb291dab438"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8b3ff2193a08e5da889e617385"`);
        await queryRunner.query(`DROP TABLE "project_stems"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d0f8f3810f107c59bc0074b316"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_138b261432f117d9241d3027f1"`);
        await queryRunner.query(`DROP TABLE "project_collaborators"`);
        await queryRunner.query(`DROP TABLE "voting_groups"`);
        await queryRunner.query(`DROP TABLE "semaphore_identities"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_71247c75ff88bbd3ed112d9df1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_48ec5fcf335b99d4792dd5e453"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2187088ab5ef2a918473cb9900"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_09d1ab20bb93b06d29f578d0bd"`);
        await queryRunner.query(`DROP TABLE "project_revisions"`);
        await queryRunner.query(`DROP TABLE "project_queues"`);
        await queryRunner.query(`DROP TABLE "queued_stems"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d8c388926efa358119843f7e52"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a919da6e685fb375c9342186b0"`);
        await queryRunner.query(`DROP TABLE "stems"`);
    }

}

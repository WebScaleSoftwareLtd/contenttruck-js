// contenttruck-js. Copyright (C) Web Scale Software Ltd 2023.
// This code is licensed under the MIT license. See the LICENSE file for details.

import z from 'zod';

export const uploadRequestSchema = z.object({
    key: z.string().min(1),
    partition: z.string().min(1),
    relativePath: z.string().optional(),
    contentType: z.string().min(1),
    content: z.instanceof(ArrayBuffer),
});

export const deleteRequestSchema = z.object({
    key: z.string().min(1),
    partition: z.string().min(1),
    relativePath: z.string().optional(),
});

export const createKeyRequestSchema = z.object({
    sudoKey: z.string().min(1),
    name: z.string().min(1),
    partitions: z.string().min(1),
});

export const deleteKeyRequestSchema = z.object({
    sudoKey: z.string().min(1),
    key: z.string().min(1),
});

export const createPartitionRequestSchema = z.object({
    sudoKey: z.string().min(1),
    name: z.string().min(1),
    ruleSet: z.string().min(1),
});

export const deletePartitionRequestSchema = z.object({
    sudoKey: z.string().min(1),
    name: z.string().min(1),
});

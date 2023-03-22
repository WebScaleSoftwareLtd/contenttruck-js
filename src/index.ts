// contenttruck-js. Copyright (C) Web Scale Software Ltd 2023.
// This code is licensed under the MIT license. See the LICENSE file for details.

import fetch from 'cross-fetch';
import z from 'zod';
import {
    uploadRequestSchema,
    deleteRequestSchema,
    createKeyRequestSchema,
    deleteKeyRequestSchema,
    createPartitionRequestSchema,
    deletePartitionRequestSchema,
} from './schemas';

// Re-export the schemas.
export {
    uploadRequestSchema,
    deleteRequestSchema,
    createKeyRequestSchema,
    deleteKeyRequestSchema,
    createPartitionRequestSchema,
    deletePartitionRequestSchema,
};

export enum ErrorCode {
    InternalServerError = 'internal_server_error',
    InvalidType = 'invalid_type',
    InvalidJSON = 'invalid_json',
    InvalidKey = 'invalid_key',
    InvalidPath = 'invalid_path',
    InvalidPartition = 'invalid_partition',
    InvalidHeaders = 'invalid_headers',
    TooLarge = 'too_large',
    ValidationFailed = 'validation_failed',
    PartitionsEmpty = 'partitions_empty',
    InvalidRuleSet = 'invalid_rule_set',
    PartitionExists = 'partition_exists',
};

export class APIError extends Error {
    public code: ErrorCode;
    public message: string;

    constructor(code: ErrorCode, message: string) {
        super(message);
        this.code = code;
        this.message = message;
    }
}

export class Client {
    private baseUrl: URL;

    constructor(baseUrl: string) {
        // Validate the base URL.
        if (!baseUrl) {
            throw new Error('baseUrl is required');
        }
        this.baseUrl = new URL(baseUrl);
    }

    private async _doRpcRequest(type: string, jsonBody: any, contentBody?: {
        contentType: string,
        content: ArrayBuffer
    }): Promise<any> {
        // Build the URL.
        const url = new URL(this.baseUrl);
        url.pathname = '/_contenttruck';

        // Encode the body into json.
        const body = JSON.stringify(jsonBody);

        // Build the headers.
        const headers: {[key: string]: string} = {
            'X-Type': type,
        };
        if (contentBody) {
            // Add information about hte content.
            headers['Content-Type'] = contentBody.contentType;
            headers['Content-Length'] = contentBody.content.byteLength.toString();
            headers['X-Json-Body'] = body;
        } else {
            // Add the body.
            headers['Content-Type'] = 'application/json';
            headers['Content-Length'] = body.length.toString();
        }

        // Build the request.
        const res = await fetch(url.toString(), {
            method: 'POST',
            headers,
            body: contentBody ? contentBody.content : body,
        });

        // Check if the response is ok.
        if (res.ok) {
            if (res.status === 204) return;
            return await res.json();
        }

        // Check if it is JSON.
        const t = await res.text();
        let j: any = {};
        try {
            j = JSON.parse(t);
        } catch (_) {}
        if (j.code && j.message) throw new APIError(j.code, j.message);
        throw new Error(`Unexpected error: status = ${res.status}, body = ${t}`);
    }

    upload(body: z.infer<typeof uploadRequestSchema>): Promise<{size: number}> {
        uploadRequestSchema.parse(body);
        return this._doRpcRequest('Upload', {
            key: body.key,
            partition: body.partition,
            relative_path: body.relativePath,
        }, {
            contentType: body.contentType,
            content: body.content,
        });
    }

    delete(body: z.infer<typeof deleteRequestSchema>): Promise<void> {
        deleteRequestSchema.parse(body);
        return this._doRpcRequest('Delete', {
            key: body.key,
            partition: body.partition,
            relative_path: body.relativePath,
        });
    }

    createKey(body: z.infer<typeof createKeyRequestSchema>): Promise<{key: string}> {
        createKeyRequestSchema.parse(body);
        return this._doRpcRequest('CreateKey', {
            sudo_key: body.sudoKey,
            partitions: body.partitions,
        });
    }

    deleteKey(body: z.infer<typeof deleteKeyRequestSchema>): Promise<void> {
        deleteKeyRequestSchema.parse(body);
        return this._doRpcRequest('DeleteKey', {
            sudo_key: body.sudoKey,
            key: body.key,
        });
    }

    createPartition(body: z.infer<typeof createPartitionRequestSchema>): Promise<void> {
        createPartitionRequestSchema.parse(body);
        return this._doRpcRequest('CreatePartition', {
            sudo_key: body.sudoKey,
            name: body.name,
            rule_set: body.ruleSet,
        });
    }

    deletePartition(body: z.infer<typeof deletePartitionRequestSchema>): Promise<void> {
        deletePartitionRequestSchema.parse(body);
        return this._doRpcRequest('DeletePartition', {
            sudo_key: body.sudoKey,
            name: body.name,
        });
    }
}

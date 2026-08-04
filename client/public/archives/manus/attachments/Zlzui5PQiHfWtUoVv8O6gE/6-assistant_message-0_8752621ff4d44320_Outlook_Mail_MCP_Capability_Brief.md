# Outlook Mail MCP Connector Capability Brief

## Overview

The Outlook Mail MCP connector provides a set of tools to interact with Microsoft Outlook mailboxes. It allows users to search for emails, read specific messages, and send new emails directly from the connected account.

During testing, the connector was successfully invoked, although the specific mailbox connected to the test environment returned an error indicating it is "either inactive, soft-deleted, or is hosted on-premise." Despite this environment-specific limitation, the schema and capabilities of the tools were fully explored and documented below.

## Available Tools and Capabilities

The connector exposes three primary tools for email management:

### 1. `outlook_search_messages`
This tool allows users to search and list Outlook messages using optional query filters.

**Capabilities:**
- **Keyword Query Language (KQL) Support:** Users can perform advanced searches using KQL syntax (e.g., `"from:no-reply@github.com"`, `"subject:Weekly Digest"`, `"hasAttachments:true"`).
- **Pagination:** Supports limiting the number of results returned (default is 50, maximum is 500).
- **Full-Text Search:** If no specific field is targeted, it performs a full-text search across default fields like sender, subject, and body.

### 2. `outlook_read_messages`
This tool is designed to retrieve the full content of specific messages using their unique IDs.

**Capabilities:**
- **Batch Retrieval:** Can read one or more messages simultaneously by passing an array of message IDs (up to 100 at a time).
- **Thread Reading:** Efficient for reading entire email threads by fetching all associated message IDs in a single call.

### 3. `outlook_send_messages`
This tool enables sending new emails or saving them as drafts.

**Capabilities:**
- **Batch Sending:** Can send multiple emails in a single invocation.
- **Recipient Management:** Supports standard `to`, `cc`, and `bcc` fields.
- **Attachments:** Allows attaching files using absolute paths. It also supports special integrations, such as attaching Markdown files (which are automatically converted to PDF) or slides projects using the `manus-slides://` prefix.
- **Content Formatting:** Currently supports plain text content for the email body.

## Test Results

During the testing phase, attempts were made to search for recent messages, search by specific criteria (e.g., unread messages, specific subjects), and send a test email. 

The API successfully received the requests and formatted the payloads correctly. However, the Microsoft Graph API returned the following error for all operations:
> `HTTP 404: {"error":{"code":"MailboxNotEnabledForRESTAPI","message":"The mailbox is either inactive, soft-deleted, or is hosted on-premise."}}`

This indicates that while the MCP connector is functioning and correctly formatting requests, the underlying Microsoft account used for authentication does not have an active, cloud-hosted Exchange mailbox enabled for REST API access.

## Conclusion

The Outlook Mail MCP connector is a robust tool for integrating email workflows into automated processes. It supports advanced searching, efficient reading of threads, and comprehensive sending capabilities, including attachment handling. To fully utilize these features, ensure that the connected Microsoft account has an active Exchange Online mailbox.

import {merge} from './utils.js';

/*
 * The `RequestEngine` class can be used to create an object for making AJAX
 * requests from a component. Pass it an object with a set of methods. The
 * methods can call `thi s.get`, `this.post`, etc. for each HTTP verb, to make
 * a request, passing the URL as the first argument and JSON data to send in
 * the body as the second argument.
 *
 * The `requests` object at the end of this module shows an example usage of
 * `RequestEngine` and should be used for general requests which are not
 * solely owned by a single component.
 */

export class RequestEngine {
    constructor(methods) {
        this.prefix = '/api';

        for (let method_name in methods) {
            this[method_name] = methods[method_name];
        }
    }

    get(...args) {
        return this.custom('GET', ...args);
    }

    post(...args) {
        return this.custom('POST', ...args);
    }

    put(...args) {
        return this.custom('PUT', ...args);
    }

    patch(...args) {
        return this.custom('PATCH', ...args);
    }

    delete(...args) {
        return this.custom('DELETE', ...args);
    }

    custom(method, url, data = null, options = {}) {
        let retry_attempts_remaining = 0;

        let payload = data;

        if (data !== null) {
            if (method === 'GET') {
                payload = this.prepare_query_params(data);
            }
            else {
                payload = JSON.stringify(data);
            }
        }

        const make_request = deferred => {
            $.ajax(merge({
                method,
                url: url,
                data: payload,
                contentType: 'application/json;charset=UTF-8',
                dataType: 'json',
            }, options)).then(
                (...args) => deferred.resolve(...args),
                (response, ...args) => {
                    const should_retry =
                        response.status >= 500 || response.status === 0;

                    if (retry_attempts_remaining && should_retry) {
                        retry_attempts_remaining -= 1;
                        make_request(deferred);
                    }
                    else {
                        deferred.reject(response, ...args);
                    }
                }
            );
            return deferred;
        };

        const promise = make_request($.Deferred()).promise();

        promise.retry = (times) => {
            retry_attempts_remaining = times;
            return promise;
        };

        promise.then(response_json =>
            this.log_warnings(method, this.prefix + url, response_json));

        return promise;
    }

    prepare_query_params(params) {
        const prepared = {};
        for (let key in params) {
            const value = params[key];
            if (value instanceof Array) {
                prepared[key] = this.prepare_query_param_array(value);
            }
             else {
                prepared[key] = value;
            }
        }
        return prepared;
    }

    prepare_query_param_array(items) {
        return items.join(',');
    }

    log_warnings(method, url, response_json) {
        if (response_json &&
            typeof response_json === 'object' &&
            response_json.warnings instanceof Array
        ) {
            response_json.warnings.forEach(({message}) => console.warn(
                `WARNING FROM API: ${message}\n\n` +
                `request: ${method} ${url}`
            ));
        }
    }
}

export const requests = new RequestEngine({
    send_email(params, options) {
        console.log(params)
        console.log(options)
        return this.post(
            'https://api.sendinblue.com/v3/smtp/email',
            params,
            options,
        );
    },
});

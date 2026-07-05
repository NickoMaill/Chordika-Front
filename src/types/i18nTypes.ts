import { RecursiveKeyOf } from './custom';

export type TranslationResourcesType = {
    common: {
        homepage;
        title;
        yes;
        no;
        send;
        noResultDb;
        changeLang;
        sendMessage;
        openMenu;
        search;
        emailAddress;
        password;
        welcome;
        resend;
        add;
        update;
        dismiss;
        delete;
        import;
        addedAt;
        addedAtFem;
        updatedAt;
        youAdd;
        youUpdate;
        youDismiss;
        youDelete;
        adding;
        updating;
        deleting;
        back;
        filter;
        filters;
        details;
        close;
        period;
        name;
        informations;
        mainInfo;
        description;
        text;
        date;
        lastUpd;
        lastUpdate;
        resume;
        status;
        progress;
        event;
        loading;
        state;
        dark;
        light;
        overview;
        importCSV;
        contact;
        actions;
        action;
        ok;
        specifiers: {
            singularApos;
            singularFem;
            singularMasc;
            plural;
        };
        table: {
            columns: {
                showAll;
                hideAll;
                placeholder;
                search;
                singular;
                plural;
                density;
                comfortable;
                skinny;
                regular;
                selectedLines;
            };
            nav: {
                resultPerPage;
            };
            filter: {
                sortAsc;
                sortDesc;
                hideColumns;
                manageColumns;
                label;
            };
        };
    };
    businessTerms: {
        event;
    };
    entity: {
        user;
        users;
        log;
        company;
        companies;
        project;
        projects;
        planning;
        plannings;
        category;
        categories;
        subCategory;
        subCategories;
        task;
        tasks;
    };
    login: {
        rememberMe;
        forgotPassword;
        pleaseConnect;
        connect;
        reset;
        wrongCredentials;
        expiredSession;
        expiredMfa;
        requiredEmail;
        requiredPassword;
        resetTitle;
        resetMessage;
        resetDetails;
        resetLabel;
        MfaTitle;
        MfaSubtitle;
        MfaDetails;
        resendMfa;
    };
    profile: {
        title;
        mainInfo;
        intro;
        username;
        name;
        firstName;
        lastName;
        email;
        levelAccess;
        lastCon;
        addedAt;
        history;
        colors: {
            needSelect;
            saved;
            deleted;
            savedColor;
            noSaved;
        };
    };
    nav: {
        profile;
        users;
        setup;
        companies;
        activity;
        schedules;
        logout;
        projects;
        proxy;
        notFound;
        myScore;
        scoreAdd;
        scoreImport;
        adverts;
    };
    proxy: {
        title;
        message;
        search;
        choose;
        noProxy;
    };
    home: {
        welcome;
    };
    logs: {
        singular;
        plural;
        proxy;
        action;
        addedAt;
        info;
    };
    categories: {
        singular;
        plural;
    };
    user: {
        singular;
        plural;
        username;
        name;
        firstName;
        lastName;
        email;
        levelAccess;
        admin;
        password;
    };
    schedule: {
        singular;
        plural;
        freq;
        isActive;
        lastExec;
        startedAt;
        endedAt;
        nextExec;
        method;
        monitoring;
        monitoringLoading;
        history;
        error;
        timeout;
        ongoing;
        standby;
        ended;
    };
    company: {
        singular;
        plural;
        name;
        shortName;
        type;
        client;
        supplier;
        provider;
        agency;
        logoPath;
        role;
    };
    project: {
        singular;
        plural;
        edit;
        create;
        new;
        search;
        status: {
            incoming;
            ongoing;
            ended;
        };
        priority: {
            title;
            normal;
            high;
            critical;
        };
        dates: {
            start;
            end;
            startEvent;
            endEvent;
            startSetup;
            endSetup;
            startTeardown;
            endTeardown;
        };
        teams: {
            singular;
            plural;
            import: {
                action;
                importLabel;
                list: {
                    l1;
                    l2;
                    l3;
                    l4;
                    l5;
                };
                advertMessage;
                downloadTemplate;
            };
            add: {
                action;
                addManual;
                addLabel;
            };
            update: {
                action;
            };
            delete: {
                action;
                title;
                advert;
                consequences;
                noRecover;
                shouldContinue;
            };
            noTeam;
            teamHelpText;
            endText;
        };
        member: {
            singular;
            plural;
            job;
            toComplete;
            toConfirm;
            complete;
            partials;
            listTitle;
            listSubtitle;
            searchPlaceholder;
            manageResources;
            allStatus;
            allStates;
            add: {
                action;
            };
            update: {
                action;
            };
        };
        actionMessage: {
            root: {
                updated;
                update;
                dismiss;
                dismissConfirm;
                dismissReject;
            };
            company: {
                add;
                added;
                update;
                updated;
                delete;
                deleted;
                defineRole;
            };
        };
    };
    planning: {
        singular;
        plural;
        who;
        what;
        color;
        fontColor;
        colorPreview;
        colorPlaceholder;
        category: {
            add;
            update;
            delete;
        };
        subCategory: {
            add;
            update;
            delete;
        };
        task: {
            update;
            delete;
            status: {
                ongoing;
                incoming;
                waiting;
                ended;
            };
        };
        promptDelete: {
            placeholder;
            category: {
                title;
                message;
                target;
            };
            subCategory: {
                title;
                message;
                target;
            };
            task: {
                title;
                message;
                target;
            };
            company: {
                title;
                message;
                target;
            };
        };
    };
    error: {
        common: {
            error;
        };
        errorMessage;
        errorBoundary: {
            sorry;
            firstErrorMessage;
            supportEmail;
            technicalStaff;
            thanks;
            toSendMessage;
            pleaseSend;
            thenClick;
            errorReport;
            diag;
            source;
            at;
            trace;
            page;
            clockDate;
            browser;
            address;
            linkForward;
        };
        noAccess: {
            intro;
            please;
            expired;
            login;
        };
    };
    center: {
        search: {
            newSearch;
            updateSearch;
            filters;
            nothing;
            orderBy;
            total;
            ref;
        };
        bulk: {
            bulkUpdate;
            bulkAdd;
            downloadTemplate;
            importXlsx;
            bulkAddMessage;
            bulkTitle;
            exportXlsx;
            exportCSV;
        };
        update: {
            success;
        };
        create: {
            success;
        };
        delete: {
            success;
        };
    };
};

export type LangType = 'fr' | 'en';
export type TranslateType = RecursiveKeyOf<TranslationResourcesType>;
